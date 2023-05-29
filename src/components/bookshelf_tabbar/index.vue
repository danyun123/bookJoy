<template>
	<div class="bookshelf_tabbar">
		<div :class="{ list: true, notSelected: !props.haveSelected }">
			<div
				class="download item"
				@click="() => itemClick('download')"
				v-if="currentPage === 'bookshelf' || currentPage === 'groupDetail'"
			>
				<van-icon name="down" />
				<span>离线下载</span>
			</div>
			<div
				class="grouping item"
				@click="() => itemClick('grouping')"
				v-if="currentPage === 'bookshelf' || currentPage === 'groupDetail'"
			>
				<van-icon name="exchange" />
				<span>移到分组</span>
			</div>
			<div class="grouping item" @click="() => itemClick('removeGroup')" v-if="currentPage === 'groupDetail'">
				<van-icon name="exchange" />
				<span>移出该组</span>
			</div>
			<div class="delete item" @click="() => itemClick('delete')">
				<van-icon name="delete-o" />
				<span>删除</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia/dist/pinia";
import useBookshelf from "@/store/bookshelf";

interface IProps {
	haveSelected: boolean;
}
const { currentPage } = storeToRefs(useBookshelf());
const props = defineProps<IProps>();
const emits = defineEmits(["downloadClick", "groupingClick", "deleteClick", "removeGroupClick"]);
const itemClick = (type: "download" | "grouping" | "delete" | "removeGroup") => {
	emits(`${type}Click`);
};
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.bookshelf_tabbar {
	position: absolute;
	bottom: 0;
	z-index: 20;
	width: 100%;
	background-color: #ececec;
	font-size: 1rem;
	padding: 0.214rem 0;
	margin-left: -$pagePadding;
	border-top-left-radius: 1.071rem;
	border-top-right-radius: 1.071rem;
	.list {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.item {
			flex: 1;
			padding: 0.21rem;
			text-align: center;
			display: flex;
			flex-direction: column;
			color: $themeColor;
			& > span {
				margin-top: 0.357rem;
			}
		}
	}
	.notSelected {
		@include disabledStyle;
	}
}
</style>
