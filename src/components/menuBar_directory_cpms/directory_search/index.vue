<template>
	<div class="search" ref="searchRef" @scroll.stop="(e) => handelSearchScroll(e)">
		<template v-if="realProxyObject(listContent ?? []).length !== 0">
			<div class="list" ref="listRef" v-if="realProxyObject(listContent ?? []).length > 0">
				<template v-for="item in realProxyObject(listContent ?? []).splice(0, contentSubsection)" :key="item.cfi">
					<div class="item" v-html="item.excerpt" @click="() => handelClickSearchItem(item.cfi)"></div>
				</template>
			</div>
		</template>
		<div v-if="isSearching" class="searching">正在为您全速搜索--------</div>
		<div v-else-if="listContent && realProxyObject(listContent)?.length === 0 && !isSearching" class="searching">
			未找到结果
		</div>
	</div>
</template>

<script setup lang="ts">
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import { doSearch, getCurrentLocation } from "@/utils/bookContent";
import { realProxyObject } from "@/utils/common";
import type { Book } from "epubjs";
import { onMounted, onUnmounted, ref, watch } from "vue";
import throttle from "@/utils/throttle";
import useDirectory from "@/store/directory";

const searchRef = ref<HTMLDivElement>();
const listRef = ref<HTMLDivElement>();
const bookStore = useBooks();
const directoryStore = useDirectory();
const { confirmSearch, searchValue } = storeToRefs(directoryStore);
const { bookPrototype, showDialog, currentMenu, currentLocationPercentage, totalPageLength, currentSection } =
	storeToRefs(bookStore);
const listContent = ref<any[] | undefined>(undefined);
const contentSubsection = ref(10);
const searchEleHeight = ref(0);
const listEleHeight = ref(0);
const isAnalysisOver = ref(false);
const isSearching = ref(false);
bookPrototype.value.ready.then(() => {
	isAnalysisOver.value = true;
});
const stopWatchSrarch = watch(
	[confirmSearch, searchValue],
	() => {
		if (confirmSearch.value && searchValue.value.trim().length > 0) {
			if (!isSearching.value) {
				isSearching.value = true;
				doSearch(bookPrototype.value as Book, searchValue.value)
					.then((res) => {
						listContent.value = res.map((item: any) => {
							item.excerpt = item.excerpt.replace(
								new RegExp(searchValue.value, "gi"),
								`<span class='light_height_text'>$&</span>`
							);
							return item;
						});
					})
					.then(() => {
						isSearching.value = false;
					});
			}
			confirmSearch.value = false;
		}
	},
	{ deep: true }
);
const stopWatchList = watch([listRef], () => {
	listEleHeight.value = listRef.value?.offsetHeight as number;
});
onMounted(() => {
	searchEleHeight.value = searchRef.value!.offsetHeight;
});
const handelSearchScroll = throttle((e: Event) => {
	listEleHeight.value = listRef.value!.offsetHeight;
	if (
		(e.target as (EventTarget | null) & { scrollTop: number }).scrollTop + searchEleHeight.value - 33 >=
		listEleHeight.value
	) {
		//@ts-ignore
		if (contentSubsection.value < listContent.value?.length) contentSubsection.value += 15;
	}
}, 1000);
const handelClickSearchItem = (cfi: string) => {
	bookPrototype.value.rendition.display(cfi).then(() => {
		currentLocationPercentage.value = getCurrentLocation(bookPrototype.value as Book, totalPageLength.value).percentage;
		currentSection.value = getCurrentLocation(bookPrototype.value as Book, totalPageLength.value).section;
	});
	showDialog.value = false;
	currentMenu.value = "";
	bookPrototype.value.rendition.annotations.highlight(cfi);
};
onUnmounted(() => {
	stopWatchList();
	stopWatchSrarch();
});
</script>

<style scoped lang="scss">
.search {
	width: 100%;
	height: calc(100% - 54px);
	overflow: scroll;
	box-sizing: border-box;
	position: relative;
	.list {
		.item {
			padding: 0 0.714rem 1.429rem 1.234rem;
			margin: 1.214rem 0;
			border-bottom: 1px solid #9b8d8d;
			box-sizing: border-box;
			:deep(.light_height_text) {
				color: red;
				font-weight: 600;
			}
		}
	}
	.searching {
		position: absolute;
		z-index: 1001;
		font-size: 1.2rem;
		left: 50%;
		transform: translateX(-50%);
		top: 4%;
		color: red;
		white-space: nowrap;
		background-color: #d7cf96;
		padding: 0.714rem;
	}
}
</style>
