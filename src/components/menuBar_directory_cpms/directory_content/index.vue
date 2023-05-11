<template>
	<div class="directory_content">
		<div class="search_content">
			<van-search
				v-model="searchValue"
				clearable
				placeholder="搜索全文内容"
				@search="handelOnSearch"
				background="transparent"
				@focus="handelInputFocus"
				@keydown.exact.enter="confirmSearch = true"
			>
				<template #left v-if="displayReturnBtn">
					<div class="return"><van-icon name="arrow-left" @click="handelReturnClick" />返回</div>
				</template>
			</van-search>
			<div class="confirm" v-if="displayReturnBtn" @click="confirmSearch = true">确认</div>
		</div>
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
const { displayCpm, searchValue, confirmSearch } = storeToRefs(directoryStore);
const displayReturnBtn = ref(false);
const currentPage = shallowRef<Component>(Directory_detailed);
const handelInputFocus = () => {
	displayReturnBtn.value = true;
	displayCpm.value = "Directory_search";
};
const handelReturnClick = () => {
	displayReturnBtn.value = false;
	displayCpm.value = "Directory_content";
	searchValue.value = "";
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
	:deep(.van-search) {
		flex: 1;
	}
	:deep(.van-field__control) {
		&::placeholder {
			color: #656565;
		}
	}
	.search_content {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.confirm {
			background-color: #fafafa;
			border-radius: 1.271rem;
			padding: 2px 6px;
			margin: 0 0.222rem 0 0;
			height: 34px;
			line-height: 34px;
			font-size: 0.9rem;
			white-space: nowrap;
		}
		.return {
			margin: 0 0.414rem 0 -0.387rem;
		}
	}
}
</style>
