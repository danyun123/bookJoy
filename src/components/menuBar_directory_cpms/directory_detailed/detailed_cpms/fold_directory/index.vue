<template>
	<div class="fold">
		<van-collapse v-model="activeName" ref="collapseRef">
			<template v-for="item in entireDirectory" :key="item.id">
				<van-collapse-item
					:noChild="item.subitems.length === 0"
					:title="item.label"
					:name="strToNum(item.id)"
					:is-link="item.subitems.length !== 0"
					:readonly="false"
					@click.stop="(e) => handelClick(e, item.id)"
					:class="{
						selected: strToNum(item.id) - 1 === currentSection,
						childSelected: isChildSelected(currentSection, item.subitems)
					}"
				>
					<template v-if="item.subitems.length !== 0"><Fold_recursion :data="item.subitems" /></template>
				</van-collapse-item>
			</template>
		</van-collapse>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import Fold_recursion from "./fold_recursion.vue";
import type { CollapseInstance } from "vant";
import { strToNum } from "@/utils/common";
import { isChildSelected } from "@/utils/bookContent";
import throttle from "@/utils/throttle";

const collapseRef = ref<CollapseInstance>();
const bookStore = useBooks();
const { entireDirectory, currentSection, directorySelected } = storeToRefs(bookStore);
const activeName = ref(["1"]);
const handelClick = throttle((e: Event, sectionId: string) => {
	if (
		(e.target as (EventTarget & { className: string }) | null)?.className ===
			"van-badge__wrapper van-icon van-icon-arrow van-cell__right-icon" ||
		sectionId === directorySelected.value
	)
		return;
	directorySelected.value = sectionId;
	currentSection.value = strToNum(sectionId) - 1;
}, 1000);
onMounted(() => {
	collapseRef.value?.toggleAll(true);
});
</script>

<style scoped lang="scss">
@import "../../../../../assets/css/common";
.fold {
	height: calc(88.5% - 21px - 2.55rem);
	overflow: scroll;
	-webkit-overflow-scrolling: touch;
	.van-collapse-item {
		border-bottom: 0.123rem solid #c0c0c0;
	}
	.van-collapse-item:last-child {
		border-bottom: none;
	}
	.van-collapse-item[noChild="true"] {
		:deep(.van-collapse-item__wrapper) {
			display: none;
		}
	}
	:deep(.van-collapse-item__title) {
		background-color: rgba(226, 226, 226, 0.8);
		transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
	}
	:deep(.van-cell__title) > span {
		@include displayMultiline();
	}
	.selected > :deep(.van-collapse-item__title) {
		background-color: $themeColor !important;
		color: white;
	}
	:deep(.van-collapse-item__title) {
	}
	.childSelected > :deep(.van-collapse-item__title) {
		background: #a9a7a7;
	}
}
</style>
