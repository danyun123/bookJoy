<template>
	<div class="directory_content">
		<van-search
			v-model="inputValue"
			:show-action="displayCancelBtn"
			placeholder="搜索全文内容"
			@search="handelOnSearch"
			background="transparent"
			@focus="handelInputFocus"
			@cancel="handelInputBlur"
		>
		</van-search>
		<component :is="currentPage" />
	</div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { ref, shallowRef, watchEffect } from "vue";
import useDirectory from "@/store/directory";
import { storeToRefs } from "pinia/dist/pinia";
import Directory_detailed from "../directory_detailed/index.vue";
import Directory_search from "../directory_search/index.vue";

const directoryStore = useDirectory();
const { displayCpm } = storeToRefs(directoryStore);
const displayCancelBtn = ref(false);
const inputValue = ref();
const currentPage = shallowRef<Component>(Directory_detailed);
const handelInputFocus = () => {
	displayCancelBtn.value = true;
	displayCpm.value = "Directory_search";
};
const handelInputBlur = () => {
	displayCancelBtn.value = false;
	displayCpm.value = "Directory_content";
};
const handelOnSearch = () => {};
watchEffect(() => {
	switch (displayCpm.value) {
		case "Directory_search":
			currentPage.value = Directory_search;
			return;
		case "Directory_detailed":
			currentPage.value = Directory_detailed;
			return;
		case "Directory_content":
			currentPage.value = Directory_detailed;
	}
});
</script>

<style scoped lang="scss">
.directory_content {
	height: 100%;
	:deep(.van-search__content--square) {
		border-radius: 1.071rem;
		background-color: #fbfbfb;
	}
}
</style>
