<template>
	<div id="book_content"></div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router/dist/vue-router";
import ePub from "epubjs";
import { getBooksConfig, getBookUrl } from "@/utils";
import useBooks from "../../../store/books/index";
import { storeToRefs } from "pinia/dist/pinia";
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import useGlobal, { type themeColorType } from "@/store/global";
import { entireThemeColor } from "@/assets/data/global";

const booksStore = useBooks();
const globalStore = useGlobal();
const { themeColor } = storeToRefs(globalStore);
let { currentBook, showBar, showDialog, fontSize, fontFamily, currentMenu, directoryLoadOver } =
	storeToRefs(booksStore);
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
	book.locations.generate((750 * (window.innerWidth / 375) * fontSize.value) / 12).then((res) => {
		console.log(res);
		directoryLoadOver.value = true;
	});
});
const bookExample = book.renderTo("book_content", {
	width: innerWidth,
	height: innerHeight
	// flow: "scrolled-doc"
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
	currentMenu.value = "";
	e.stopPropagation();
});
onMounted(() => {
	const { local_font_family, local_font_size, local_theme_color } = getBooksConfig();
	fontSize.value = local_font_size ? Number(local_font_size) : 12;
	fontFamily.value = local_font_family ?? "Default";
	themeColor.value = (local_theme_color as themeColorType) ?? "default";
});
watchEffect(() => {
	bookExample.themes.fontSize(fontSize.value + "pt");
	bookExample.themes.font(
		fontFamily.value === "Default"
			? '-apple-system, BlinkMacSystemFont, "Microsoft Yahei", sans-serif'
			: fontFamily.value
	);
	bookExample.themes.select(themeColor.value);
});
onUnmounted(() => {
	directoryLoadOver.value = false;
});
</script>

<style lang="scss" scoped></style>
