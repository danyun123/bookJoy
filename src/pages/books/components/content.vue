<template>
  <div id="book_content" :style="{ width: pageWidth, height: pageHeight }">
    <Bookmark v-if="showBookmark" class="bookmark" />
  </div>
  <div v-if="!isReady" class="ing">正在解析中，请稍等~~~~~</div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router/dist/vue-router";
import Epub, { Book } from "epubjs";
import { getBooksConfig } from "@/utils/common";
import type { bookmarkType } from "@/utils/bookContent";
import {
  flatNavArr,
  formatFlatNavArr,
  getBookUrl,
  getCurrentLocation,
  getCurrentPageCFI,
  getCurrentSectionInfo
} from "@/utils/bookContent";
import useBooks, { type currentBookMetaDataType, type themeColorType } from "../../../store/books/index";
import { storeToRefs } from "pinia/dist/pinia";
import { onActivated, onBeforeUnmount, ref, watch, watchEffect } from "vue";
import { entireThemeColor } from "@/assets/data/global";
import {
  ALLBOOKMARK,
  BOOK_DETAIL_CLICK_SECTION,
  LOCAL_FONT_FAMILY,
  LOCAL_FONT_SIZE,
  LOCAL_THEME_COLOR
} from "@/assets/constant";
import Bookmark from "@/baseUI/bookmark/index.vue";
import localForage from "localforage";

const pageWidth = ref("");
const pageHeight = ref("");
const route = useRoute();
const isReady = ref(false);
watchEffect(() => {
  pageWidth.value = innerWidth + "px";
  pageHeight.value = innerHeight + "px";
});

const booksStore = useBooks();
let {
  currentBookMetaData,
  showBar,
  showDialog,
  fontSize,
  fontFamily,
  currentMenu,
  directoryLoadOver,
  currentSection,
  maxSectionLength,
  currentLocationPercentage,
  totalPageLength,
  themeColor,
  currentBookCover,
  entireDirectory,
  bookPrototype,
  allBookmarks,
  entireFlatDirectory,
  showBookmark
} = storeToRefs(booksStore);

const slideDistance = ref(0);
const slideTime = ref(0);
const isTouchToChangePage = ref(false);
const path = route.path;
const bookUrl = getBookUrl(path);

const getLocalForage = (key: string) => {
  return new Promise((resolve, reject) => {
    localForage.getItem(key, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
};

const allFun = (book: Book) => {
  bookPrototype.value = book;
  // 设置封面
  book?.loaded.cover.then((cover) => {
    book?.archive.createUrl(cover, { base64: false }).then((url) => {
      currentBookCover.value = url;
    });
  });
  book?.loaded.metadata.then((data) => {
    currentBookMetaData.value = data as currentBookMetaDataType;
  });
  book?.loaded.navigation.then((nav) => {
    const flatedNav = flatNavArr(nav.toc);
    entireFlatDirectory.value = flatedNav;
    entireDirectory.value = formatFlatNavArr(flatedNav);
  });
  book?.ready.then(() => {
    isReady.value = true;
    //@ts-ignore
    book.rendition.hooks.content.register((contents: any) => {
      Promise.all([
        contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/daysOne.css`),
        contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/cabin.css`),
        contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/montserrat.css`),
        contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/tangerine.css`)
      ]);
    });
    book?.locations.generate(150).then((res) => {
      totalPageLength.value = res.length;
      currentLocationPercentage.value = getCurrentLocation(book, totalPageLength.value).percentage;
      directoryLoadOver.value = true;
      //@ts-ignore
      const local_allBookmark: bookmarkType[] = JSON.parse(localStorage.getItem(ALLBOOKMARK + book.cover));
      allBookmarks.value = local_allBookmark ?? [];
      showBookmark.value = allBookmarks.value.some((item) => item.cfi === getCurrentPageCFI(book));
    });
    //@ts-ignore
    maxSectionLength.value = book.spine.length;
    //@ts-ignore
    const progressConfig = localStorage.getItem(book.cover);
    const { percentage, section, currentLocationCFI } = progressConfig
      ? JSON.parse(progressConfig)
      : {
        percentage: null,
        section: null,
        currentLocationCFI: null
      };
    if ((percentage || percentage === 0) && section && currentLocationCFI) {
      // 跳转到指定页面
      book?.rendition.display(currentLocationCFI);
      // 设置进度百分比
      currentLocationPercentage.value = percentage;
      currentSection.value = { isInitialize: true, section: section };
    }
    // 点击章节目录进入
    const bookDetailClickSection: { href: string; section: number } = JSON.parse(
      localStorage.getItem(BOOK_DETAIL_CLICK_SECTION) ?? "[]"
    );
    if (bookDetailClickSection.href) {
      book.rendition.display(bookDetailClickSection.href);
      currentSection.value = bookDetailClickSection.section;
    }
  });
  const bookExample = book?.renderTo("book_content", {
    width: innerWidth,
    height: innerHeight,
    script: "allow-scripts",
    allowScriptedContent: true
    // flow: "scrolled-doc"
  });
  entireThemeColor.map((item) => {
    bookExample?.themes.register(item.text, item.style);
  });
  bookExample?.display();
  const initialSlideTime = ref(0);
  const initialSlideDistance = ref(0);
  bookExample?.on("touchstart", (e: TouchEvent) => {
    initialSlideDistance.value = e.changedTouches[0].clientX;
    initialSlideTime.value = e.timeStamp;
  });
  const slideSwitch = () => {
    showBar.value = false;
    showBookmark.value = allBookmarks.value.some((item) => item.cfi === getCurrentPageCFI(book));
    const newSection = getCurrentSectionInfo(book!).index;
    if (currentSection.value !== newSection) {
      isTouchToChangePage.value = true;
      currentSection.value = newSection;
    }
    currentLocationPercentage.value = getCurrentLocation(book!, totalPageLength.value).percentage;
  };
  bookExample?.on("touchend", (e: TouchEvent) => {
    if (showDialog.value) return;
    slideDistance.value = e.changedTouches[0].clientX - initialSlideDistance.value;
    slideTime.value = e.timeStamp - initialSlideTime.value;
    if (slideTime.value < 1000) {
      if (slideDistance.value > 40) {
        bookExample.prev().then(() => {
          slideSwitch();
        });
        showBar.value = false;
      } else if (slideDistance.value < -40) {
        bookExample.next().then(() => {
          slideSwitch();
        });
      }
    }
  });
  bookExample?.on("click", (e: Event & { offsetX: number }) => {
    const targetElement = e.target as HTMLElement;
    const xPosition = e.offsetX;
    const targetWidth = targetElement.offsetWidth;
    if (xPosition < 80) {
      bookExample.prev().then(() => {
        showBar.value = false;
        currentMenu.value = "";
        slideSwitch();
      });
      return;
    } else if (xPosition > targetWidth - 80) {
      bookExample.next().then(() => {
        showBar.value = false;
        currentMenu.value = "";
        slideSwitch();
      });
      return;
    }
    if (showDialog.value) {
      showDialog.value = false;
      currentMenu.value = "";
      return;
    }
    showBar.value = !showBar.value;
    currentMenu.value = "";
    e.stopPropagation();
  });
  watchEffect(() => {
    const { local_font_family, local_font_size, local_theme_color } = getBooksConfig();
    fontSize.value = local_font_size ? Number(local_font_size) : 12;
    fontFamily.value = local_font_family ?? "Default";
    themeColor.value = (local_theme_color as themeColorType) ?? "eye_protection";
  });

  watchEffect(() => {
    if (fontSize.value) {
      bookExample?.themes.fontSize(fontSize.value + "pt");
      localStorage.setItem(LOCAL_FONT_SIZE, String(fontSize.value));
    }
  });
  watchEffect(() => {
    if (fontFamily.value) {
      bookExample?.themes.font(
        fontFamily.value === "Default"
          ? "-apple-system, BlinkMacSystemFont, \"Microsoft YaHei\", sans-serif"
          : fontFamily.value
      );
      localStorage.setItem(LOCAL_FONT_FAMILY, fontFamily.value);
    }
  });
  watchEffect(() => {
    if (themeColor.value) {
      bookExample?.themes.select(themeColor.value);
      ``;
      localStorage.setItem(LOCAL_THEME_COLOR, themeColor.value);
    }
  });
  watch([currentSection], async (newValue, oldValue) => {
    if (!isTouchToChangePage.value) {
      if (!(oldValue[0] instanceof Object)) {
        if (typeof newValue[0] === "number" && directoryLoadOver) {
          const currentCfi = book?.spine.get(newValue[0]).href;
          book?.rendition.display(currentCfi).then(() => {
            showBookmark.value = allBookmarks.value.includes(getCurrentPageCFI(book));
            currentLocationPercentage.value = getCurrentLocation(book!, totalPageLength.value).percentage;
          });
        } else {
          //@ts-ignore
          currentSection.value = newValue[0].section;
        }
      }
    }
    isTouchToChangePage.value = false;
  });
  watch([allBookmarks], () => {
    showBookmark.value = allBookmarks.value.some((item) => item.cfi === getCurrentPageCFI(book));
  });
};
//
onActivated(() => {
  const isRefreshed = localStorage.getItem("isRefreshed");
  if (isRefreshed !== "true") {
    localStorage.setItem("isRefreshed", "true");
    location.reload();
  } else {
    localStorage.removeItem("isRefreshed");
  }
});
onActivated(async () => {
  const path = route.path;
  const bookName = path.split("/")[3].replace(".epub", "");
  try {
    const blob = await getLocalForage(bookName);
    if (blob) {
      // 离线
      const book = new Book(blob);
      allFun(book);
    } else {
      // 在线
      const book = new Book(bookUrl);
      allFun(book);
    }
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
  }
});
onBeforeUnmount(() => {
  localStorage.setItem(BOOK_DETAIL_CLICK_SECTION, "[]");
  directoryLoadOver.value = false;
});
</script>

<style lang="scss" scoped>
@import "../../../assets/css/common";

#book_content {
  width: 100% !important;
  height: 100% !important;
  position: relative;

  .bookmark {
    position: absolute;
    top: 0;
    right: 1.071rem;
    z-index: 1;
  }
}

.ing {
  @include remindInfo;
}
</style>
