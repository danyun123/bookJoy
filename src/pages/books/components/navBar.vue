<template>
	<div :class="{ navBar: true, 'navBar-show': showBar, 'navBar-hide': !showBar }">
		<div class="back">
			<van-icon name="arrow-left" size="1.6rem" />
			<span @click="returnClick">返回</span>
		</div>
		<div class="function">
			<div
				:class="{ bookmark: true, fun_item: true, disabledBkmk: !directoryLoadOver }"
				title="书签"
				@click="bookmarkClick"
			>
				<van-loading size="24px" vertical class="bookmarkLoading" color="#f100ff" v-if="!directoryLoadOver"
					>加载中...
				</van-loading>
				<van-icon name="bookmark-o fun_item" class="bookmarkIcon" />
			</div>
			<div
				:class="{ bookshelf: true, fun_item: true, addBookShelfed: isAdded }"
				title="书架"
				@click="addBookShelfClick"
			>
				<van-icon name="star" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import { useRouter } from "vue-router";
import type { bookmarkType } from "@/utils/bookContent";
import { getCurrentPageCFI } from "@/utils/bookContent";
import type { Book } from "epubjs";
import throttle from "@/utils/throttle";
import dayjs from "dayjs";
import { ALLBOOKMARK, ALLBOOKSHELFNAME, BOOKSHELF } from "@/assets/constant";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router/dist/vue-router";
import useHome from "@/store/home";

const booksStore = useBooks();
const isAdded = ref(false);
const { showBar, bookPrototype, allBookmarks, directoryLoadOver, currentSection, entireFlatDirectory } =
	storeToRefs(booksStore);
const router = useRouter();
const route = useRoute();
const bookClass = ref(route.path.split("/")[2]);
const bookName = ref(route.path.split("/")[3].slice(0, -5));
const bookData = ref();
const homeStore = useHome();
const { fetchBookList } = homeStore;
const { bookList } = storeToRefs(homeStore);

onBeforeMount(async () => {
	await fetchBookList();
	bookList.value.data[bookClass.value].forEach((item: any) => {
		if (item.fileName === bookName.value) {
			bookData.value = item;
			return;
		}
	});
});
const returnClick = () => {
	router.back();
};
const bookmarkClick = throttle(async () => {
	const currentCFI: string = getCurrentPageCFI(bookPrototype.value as Book);
	const currentBookmark: bookmarkType[] = [
		{
			cfi: currentCFI,
			text: {
				date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				name: entireFlatDirectory.value[currentSection.value as number].label.match(/[a-zA-Z]+/g).join(" ")
			}
		}
	];
	//@ts-ignore
	const allBookmark: bookmarkType[] = JSON.parse(localStorage.getItem(ALLBOOKMARK + bookPrototype.value.cover) ?? "[]");
	if (allBookmark && allBookmark.some((item) => item.cfi === currentBookmark[0].cfi)) {
		allBookmark.splice(
			allBookmark.findIndex((item) => item.cfi === currentBookmark[0].cfi),
			1
		);
		//@ts-ignore
		localStorage.setItem(ALLBOOKMARK + bookPrototype.value.cover, JSON.stringify(allBookmark));
		allBookmarks.value = allBookmark;
		return;
	}
	const newBookmarks = [...allBookmark, currentBookmark[0]];
	allBookmarks.value = newBookmarks;
	//@ts-ignore
	localStorage.setItem(ALLBOOKMARK + bookPrototype.value.cover, JSON.stringify(newBookmarks));
}, 666);
const addBookShelfClick = () => {
	const books = JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]");
	const names = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
	if (isAdded.value) {
		names.splice(
			names.findIndex((item: string) => item === bookName.value),
			1
		);
		books.forEach((item: any) => {
			let index;
			if (item.type === "group") {
				index = item.bookList.findIndex((book: any) => book.fileName === bookName.value);
				if (index !== -1) item.bookList.splice(index, 1);
			} else {
				index = books.findIndex((item: any) => item.fileName === bookName.value);
				if (index !== -1) books.splice(index, 1);
			}
		});
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify(names));
		localStorage.setItem(BOOKSHELF, JSON.stringify(books));
	} else {
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify([bookName.value, ...names]));
		localStorage.setItem(BOOKSHELF, JSON.stringify([bookData.value, ...books]));
	}
	isAdded.value = !isAdded.value;
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/common";

.navBar {
	@include bookBar();
	top: 0;
	border-radius: 0 0 $raduisWidth $raduisWidth;
	z-index: 9;

	.back {
		color: $themeColor;
		margin-left: 0.5rem;
		display: flex;
		align-content: center;
		justify-content: center;
		line-height: 1.6rem;
	}

	.function {
		display: flex;
		justify-content: space-around;

		.fun_item {
			display: flex;
			justify-content: center;
			flex: 1;
			font-size: $fontSize;
			color: $themeColor;
			width: 3.8rem;
			height: $barHeight;
			@include clickActiveAnimation;

			.van-icon {
				line-height: $barHeight;
			}

			.van-icon-star {
				color: black;
			}
		}

		.addBookShelfed {
			.van-icon-star {
				color: #d5d100 !important;
			}
		}

		.disabledBkmk {
			@include disabledStyle;
		}

		.bookmark {
			position: relative;

			:deep(.bookmarkLoading) {
				position: absolute !important;

				.van-loading__text {
					white-space: nowrap;
					margin-left: 0.929rem;
				}
			}
		}
	}
}

.navBar-hide {
	top: -$barHeight !important;
}

.navBar-show {
	opacity: 1 !important;
	top: 0;
}
</style>
