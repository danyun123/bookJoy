<template>
	<div class="display_group" @click="groupClick">
		<TransitionGroup name="list" id="VUE_transition" tag="div">
			<template v-for="(item, index) in bookListFormat" :key="index">
				<div class="item">
					<div class="cover" v-if="item.cover" ref="imgRef">
						<img :src="item.cover" alt="图片加载错误" ref="imgRef" />
					</div>
					<div
						v-else
						class="emptyBook"
						:style="{
							height: groupItemHeight + 'px'
						}"
					></div>
				</div>
			</template>
		</TransitionGroup>
		<div class="groupName">{{ props.bookData.name }}</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia/dist/pinia";
import type { groupDataListType } from "@/store/bookshelf";
import useBookshelf from "@/store/bookshelf";

interface IProps {
	bookData: groupDataListType;
}
const { groupItemHeight, showGroupDetail, groupDetailData, currentPage, isEditing } = storeToRefs(useBookshelf());
const imgRef = ref<Element>();
const props = defineProps<IProps>();
const bookListFormat = computed(() => {
	let bookData: any[] = [];
	props.bookData.bookList.map((item: any) => {
		if (item.type === "group") {
			item.bookList.map((i: any) => {
				bookData.push(i);
			});
		} else {
			bookData.push(item);
		}
	});
	if (bookData.length < 4) {
		const fillArr = new Array(4 - bookData.length).fill("");
		bookData = bookData.concat(fillArr);
	}
	return bookData.slice(0, 4);
});
const groupClick = () => {
	if (isEditing.value) return;
	showGroupDetail.value = true;
	groupDetailData.value = props.bookData;
	currentPage.value = "groupDetail";
};
window.addEventListener("resize", () => {
	if ((imgRef.value as any)?.[0]) groupItemHeight.value = (imgRef.value as any)[0].offsetHeight;
});
onMounted(() => {
	if (imgRef.value && (imgRef.value as any).length > 0) {
		setTimeout(() => {
			groupItemHeight.value = (imgRef.value as any)[0].offsetHeight;
		}, 0);
	}
});
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";
.display_group {
	height: 100%;
	#VUE_transition {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		padding: 0 0.357rem;
		border: 1px solid #b9b9b9;
		border-radius: 5px;
		margin-bottom: 0.314rem;
		background-color: #e1d9d9;
		@include hideScrollBar;
		//.list-enter-from,
		//.list-leave-to,
		.list-leave-active {
			display: none;
		}
		.list-move,
		//.list-enter-active,
		//.list-leave-active
		{
			transition: all 0.5s ease-in-out;
		}
		.item {
			width: calc(50% - 0.4355rem);
			height: calc(50% - 1.0355rem);
			margin: 0.58rem 0;
			position: relative;
			box-sizing: border-box;
			.cover {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				@include bookFartherStyle(0.05rem, 0.214rem);
				img {
					@include bookStyle;
				}
			}
			.emptyBook {
				width: 100%;
				height: 100%;
				background-color: #9f9a9a;
				border-radius: 5px;
				flex-shrink: 0;
			}
		}
		.item:not(:nth-child(2n)) {
			margin-right: 0.871rem;
		}
	}
	.groupName {
		text-align: center;
		height: 2.4rem;
		@include displayMultiline();
		font-size: 1.1rem !important;
		color: $themeColor;
	}
}
</style>
