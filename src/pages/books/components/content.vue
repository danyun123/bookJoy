<template>
	<div id="book_content"></div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router/dist/vue-router";
import ePub from "epubjs";
import { getBookUrl } from "@/utils";
import useBooks from "../../../store/books/index";
import { storeToRefs } from "pinia/dist/pinia";
import { ref, watchEffect } from "vue";

const booksStore = useBooks();
let { currentBookUrl, showBar, showDialog, fontSize, fontFamily } = storeToRefs(booksStore);
const route = useRoute();

const path = route.path;
const bookUrl = getBookUrl(path);
currentBookUrl.value = bookUrl;
const slideDistance = ref(0);
const slideTime = ref(0);

const book = ePub(bookUrl);
const bookExample = book.renderTo("book_content", {
	width: innerWidth,
	height: innerHeight
	// flow: "scrolled-doc"
});
bookExample.display();
const initialSlideTime = ref(0);
const initialSlideDistance = ref(0);
bookExample.on("touchstart", (e: TouchEvent) => {
	initialSlideDistance.value = e.changedTouches[0].clientX;
	initialSlideTime.value = e.timeStamp;
});
book.rendition.hooks.content.register((contents: any) => {
	Promise.all([
		contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/daysOne.css`),
		contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/cabin.css`),
		contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/montserrat.css`),
		contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/tangerine.css`)
	]);
});
localStorage.setItem("kk", "xxx");
bookExample.on("touchend", (e: TouchEvent) => {
	if (showDialog.value) return;
	slideDistance.value = e.changedTouches[0].clientX - initialSlideDistance.value;
	slideTime.value = e.timeStamp - initialSlideTime.value;
	if (slideTime.value < 1000) {
		if (slideDistance.value > 80) {
			bookExample.prev();
			showBar.value = false;
		} else if (slideDistance.value < -80) {
			bookExample.next();
			showBar.value = false;
		}
	}
});
bookExample.on("click", (e: Event) => {
	if (showDialog.value) {
		showDialog.value = false;
		return;
	}
	showBar.value = !showBar.value;
	e.stopPropagation();
});
watchEffect(() => {
	bookExample.themes.fontSize(fontSize.value + "pt");
	if (fontFamily.value === "Default") {
		bookExample.themes.font(
			'-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Segoe UI, Arial, Roboto, ' +
				'"PingFang SC", "miui", "Hiragino Sans GB", "Microsoft Yahei", sans-serif'
		);
		return;
	}
	bookExample.themes.font(fontFamily.value);
});
</script>

<style lang="scss" scoped></style>
