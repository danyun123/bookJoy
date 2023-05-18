<template>
	<div class="bookmark">
		<template v-for="(item, index) in allBookmarks" :key="item.cfi">
			<div class="item" @click="() => itemClick(item.cfi)">
				<div class="index">{{ index + 1 }}、</div>
				<div class="text">
					<div class="date">{{ item.text.date }}</div>
					<div class="name">{{ item.text.name }}</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia/dist/pinia";
import useBooks from "@/store/books";
import { getCurrentLocation, getCurrentPageCFI } from "@/utils/bookContent";
import type { Book } from "epubjs";

const {
	allBookmarks,
	bookPrototype,
	currentLocationPercentage,
	totalPageLength,
	currentSection,
	showDialog,
	currentMenu,
	showBookmark
} = storeToRefs(useBooks());
const itemClick = (cfi: string) => {
	bookPrototype.value.rendition.display(cfi).then(() => {
		currentLocationPercentage.value = getCurrentLocation(bookPrototype.value as Book, totalPageLength.value).percentage;
		currentSection.value = getCurrentLocation(bookPrototype.value as Book, totalPageLength.value).section;
	});
	showBookmark.value = allBookmarks.value.some((item) => item.cfi === getCurrentPageCFI(bookPrototype.value));
	showDialog.value = false;
	currentMenu.value = "";
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/common";
.bookmark {
	width: 100%;
	height: calc(100vh - 1rem - 20px);
	overflow: scroll;
	.item {
		display: flex;
		padding: 0.714rem $pagePadding;
		margin: 0.714rem 0;
		border-bottom: 1px solid $themeGreyColor;
		align-items: center;
		.index {
			margin-right: 10px;
			color: #bc1f76;
		}
		.text {
			font-size: 1rem;
			position: relative;
			.date {
				margin-bottom: 5px;
				color: #0f8d49;
			}
			.name {
				left: 0;
				@include displayMultiline();
			}
		}
	}
}
</style>
