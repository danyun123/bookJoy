<template>
	<div id="books"></div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/dist/vue-router";
import ePub from "epubjs";
import { getBookUrl } from "@/utils";
import useBooks from "../../store/books/index";
import { storeToRefs } from "pinia/dist/pinia";
import { ref } from "vue";

const booksStore = useBooks();
const { currentBookUrl } = storeToRefs(booksStore);
const route = useRoute();

const path = route.path;
const bookUrl = getBookUrl(path);
currentBookUrl.value = bookUrl;
const slideDistance = ref(0);
const slideTime = ref(0);

const book = ePub(bookUrl);
const bookExample = book.renderTo("books",{
	width: innerWidth,
	height: innerHeight,
})
bookExample.display();
const initialSlideTime = ref(0)
const initialSlideDistance = ref(0);
bookExample.on("touchstart",(e: TouchEvent) => {
	initialSlideDistance.value = e.changedTouches[0].clientX;
	initialSlideTime.value = e.timeStamp;
})
bookExample.on("touchend",(e: TouchEvent) => {
	slideDistance.value = e.changedTouches[0].clientX - initialSlideDistance.value;
	slideTime.value = e.timeStamp - initialSlideTime.value;
	if(slideTime.value < 1000) {
		if(slideDistance.value > 35) {
			bookExample.prev();
		} else if(slideDistance.value < -35) {
			bookExample.next();
		}
	}
})

</script>

<style scoped lang="scss">
</style>