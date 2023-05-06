<template>
	<div id="book_content"></div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router/dist/vue-router";
import ePub from "epubjs";
import { getBooksConfig } from "@/utils/common";
import { getBookUrl, getCurrentLocation, getCurrentSectionInfo } from "@/utils/bookContent";
import useBooks from "../../../store/books/index";
import { storeToRefs } from "pinia/dist/pinia";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import useGlobal, { type themeColorType } from "@/store/global";
import { entireThemeColor } from "@/assets/data/global";
import { LOCAL_FONT_FAMILY, LOCAL_FONT_SIZE, LOCAL_THEME_COLOR } from "@/assets/constant";

const booksStore = useBooks();
const globalStore = useGlobal();
const { themeColor } = storeToRefs(globalStore);
let {
	currentBook,
	showBar,
	showDialog,
	fontSize,
	fontFamily,
	currentMenu,
	directoryLoadOver,
	currentSection,
	maxSectionLength,
	currentLocationPercentage,
	totalPageLength
	// currentSectionTitle
} = storeToRefs(booksStore);
const route = useRoute();

const path = route.path;
const bookUrl = getBookUrl(path);
const slideDistance = ref(0);
const slideTime = ref(0);

const book = ePub(bookUrl);

book.ready.then(() => {
	//@ts-ignore
	currentBook.value = book.cover;
	book.rendition.hooks.content.register((contents: any) => {
		Promise.all([
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/daysOne.css`),
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/cabin.css`),
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/montserrat.css`),
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/tangerine.css`)
		]);
	});
	book.locations.generate(150).then((res) => {
		totalPageLength.value = res.length;
		directoryLoadOver.value = true;
	});
	//@ts-ignore
	maxSectionLength.value = book.spine.length;
	//@ts-ignore
	const progressConfig = localStorage.getItem(book.cover);
	const { percentage, section, currentLocation } = progressConfig
		? JSON.parse(progressConfig)
		: {
				percentage: null,
				section: null,
				currentLocation: null
		  };
	if (percentage && section && currentLocation) {
		// 跳转到指定页面
		book.rendition.display(currentLocation);
		// 设置进度百分比
		currentLocationPercentage.value = percentage;
		currentSection.value = { isInitialize: true, section: section };
	}
});
const bookExample = book.renderTo("book_content", {
	width: innerWidth,
	height: innerHeight
	// flow: "scrolled-doc",
});
entireThemeColor.map((item) => {
	bookExample.themes.register(item.text, item.style);
});
bookExample.display();
const initialSlideTime = ref(0);
const initialSlideDistance = ref(0);
bookExample.on("touchstart", (e: TouchEvent) => {
	initialSlideDistance.value = e.changedTouches[0].clientX;
	initialSlideTime.value = e.timeStamp;
});
const slideSwitch = () => {
	showBar.value = false;
	currentSection.value = getCurrentSectionInfo(book).index;
	currentLocationPercentage.value = getCurrentLocation(book, totalPageLength.value);
	getCurrentLocation(book, totalPageLength.value, currentSection.value);
};
bookExample.on("touchend", (e: TouchEvent) => {
	if (showDialog.value) return;
	slideDistance.value = e.changedTouches[0].clientX - initialSlideDistance.value;
	slideTime.value = e.timeStamp - initialSlideTime.value;
	if (slideTime.value < 1000) {
		if (slideDistance.value > 80) {
			bookExample.prev().then(() => {
				slideSwitch();
			});
			showBar.value = false;
		} else if (slideDistance.value < -80) {
			bookExample.next().then(() => {
				slideSwitch();
			});
		}
	}
});
bookExample.on("click", (e: Event) => {
	if (showDialog.value) {
		showDialog.value = false;
		return;
	}
	showBar.value = !showBar.value;
	currentMenu.value = "";
	e.stopPropagation();
});
onMounted(() => {
	const { local_font_family, local_font_size, local_theme_color } = getBooksConfig();
	fontSize.value = local_font_size ? Number(local_font_size) : 12;
	fontFamily.value = local_font_family ?? "Default";
	themeColor.value = (local_theme_color as themeColorType) ?? "default";
});

watch([fontSize], () => {
	bookExample.themes.fontSize(fontSize.value + "pt");
	localStorage.setItem(LOCAL_FONT_SIZE, String(fontSize.value));
});
watch([fontFamily], () => {
	bookExample.themes.font(
		fontFamily.value === "Default"
			? '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif'
			: fontFamily.value
	);
	localStorage.setItem(LOCAL_FONT_FAMILY, fontFamily.value);
});
watch([themeColor], () => {
	bookExample.themes.select(themeColor.value);
	``;
	localStorage.setItem(LOCAL_THEME_COLOR, themeColor.value);
});
watch([currentSection], async (newValue, oldValue) => {
	// const sectionInfo = await getCurrentSectionInfo(book);
	// currentSectionTitle.value = newValue[0] === 0 ? "" : book.navigation.get(sectionInfo.href).label;
	// const currentCfi = book.rendition.currentLocation().start.cfi;
	if (!(oldValue[0] instanceof Object)) {
		if (typeof newValue[0] === "number" && directoryLoadOver) {
			const currentCfi = book.spine.get(newValue[0]).href;
			book.rendition.display(currentCfi).then(() => {
				currentLocationPercentage.value = getCurrentLocation(book, totalPageLength.value, newValue[0] as number);
			});
		} else {
			//@ts-ignore
			currentSection.value = newValue[0].section.section!;
		}
	}
});
onBeforeUnmount(() => {
	directoryLoadOver.value = false;
});
</script>

<style lang="scss" scoped></style>
