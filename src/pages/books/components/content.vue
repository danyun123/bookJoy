<template>
	<div id="book_content"></div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router/dist/vue-router";
import ePub from "epubjs";
import { getBookInfo, getBookUrl } from "@/utils";
import useBooks from "../../../store/books/index";
import { storeToRefs } from "pinia/dist/pinia";
import { onMounted, ref, watchEffect } from "vue";

const booksStore = useBooks();
let { currentBook, showBar, showDialog, fontSize, fontFamily } = storeToRefs(booksStore);
const route = useRoute();

const path = route.path;
const bookUrl = getBookUrl(path);
currentBook.value = route.params.filename as string;
const slideDistance = ref(0);
const slideTime = ref(0);

const book = ePub(bookUrl);
book.ready.then(() => {
	book.rendition.hooks.content.register((contents: any) => {
		Promise.all([
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/daysOne.css`),
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/cabin.css`),
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/montserrat.css`),
			contents.addStylesheet(`${import.meta.env.VITE_BASE_URL}/fonts/tangerine.css`)
		]);
	});
});
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
onMounted(() => {
	const { local_fontSize, local_fontFamily } = getBookInfo(currentBook.value);
	fontSize.value = local_fontSize ?? 12;
	fontFamily.value = local_fontFamily ?? "Default";
});
watchEffect(() => {
	bookExample.themes.fontSize(fontSize.value + "pt");
	if (fontFamily.value === "Default") {
		bookExample.themes.font('-apple-system, BlinkMacSystemFont, "Microsoft Yahei", sans-serif');
		return;
	}
	bookExample.themes.font(fontFamily.value);
});
</script>

<style lang="scss" scoped></style>
