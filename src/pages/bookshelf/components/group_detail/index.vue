<template>
	<div :class="{ group_detail_mark: true, show_group_detail_mark: showGroupDetail }" @click="returnClick"></div>
	<div :class="{ group_detail: true, show_group_detail: showGroupDetail }">
		<div class="detail_head">
			<div class="return" @click.stop="returnClick">
				<van-icon name="arrow-down" />
			</div>
			<!--			<div class="selectAll" @click.stop="selectAllClick" v-else>-->
			<!--				{{ !isSelectAll ? "全选" : "取消" }}-->
			<!--			</div>-->
			<div class="group_name">{{ groupDetailData.name }}</div>
			<div class="edit" @click.stop="editCLick" v-if="groupDetailData.bookList && groupDetailData.bookList.length > 0">
				{{ isEditing ? "取消" : "编辑" }}
			</div>
		</div>
		<TransitionGroup name="list" id="VUE_transition" tag="div">
			<div v-for="item in groupDetailData.bookList" :key="item.fileName" class="books">
				<div class="commonItem" @click="() => bookClick(item)">
					<div class="cover">
						<img :src="item.cover" alt="图片加载错误" />
					</div>
					<div class="author">
						{{ item.author }}
					</div>
					<div
						:class="{ selectBtn: true, selected: groupDetailSelectedList.find((i) => i.fileName === item.fileName) }"
						v-if="isEditing"
						@click.stop=""
					>
						<van-icon name="success" />
					</div>
				</div>
			</div>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia/dist/pinia";
import useBookshelf from "@/store/bookshelf";
import router from "@/router";
import { ref } from "vue";

const isSelectAll = ref(false);
const { showGroupDetail, isEditing, groupDetailData, currentPage, groupDetailSelectedList } = storeToRefs(
	useBookshelf()
);
const returnClick = () => {
	showGroupDetail.value = false;
	currentPage.value = "bookshelf";
	groupDetailSelectedList.value = [];
	isEditing.value = false;
};
const editCLick = () => {
	isEditing.value = !isEditing.value;
	isSelectAll.value = false;
	groupDetailSelectedList.value = [];
};
// const selectAllClick = () => {
// 	if (!isSelectAll.value) {
// 		groupDetailSelectedList.value = (groupDetailData.value as groupDataListType).bookList;
// 	} else {
// 		groupDetailSelectedList.value = [];
// 	}
// 	isSelectAll.value = !isSelectAll.value;
// };
const bookClick = (data: any) => {
	if (isEditing.value) {
		const index = groupDetailSelectedList.value.findIndex((item) => item.fileName === data.fileName);
		if (groupDetailSelectedList.value.find((item: any) => item.fileName === data.fileName)) {
			if (index !== -1) groupDetailSelectedList.value.splice(index, 1);
		} else {
			groupDetailSelectedList.value.unshift(data);
		}
		return;
	}
	router.push({
		path: `/bookDetail/${data.fileName}`
	});
};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";

.group_detail_mark {
	height: 100vh;
	width: 100vw;
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	z-index: 15;
	display: none;
	bottom: 0;
}
.show_group_detail_mark {
	display: inline-block !important;
}
.group_detail {
	position: absolute;
	z-index: 16;
	width: 100vw;
	height: 87vh;
	bottom: -100%;
	box-sizing: border-box;
	background-color: white;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
	transition: bottom $transition;
	padding: $pagePadding;
	.detail_head {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		color: $themeColor;
		.return {
			font-size: 1.3rem;
		}
		.edit {
			@include clickActiveAnimation;
		}
		.group_name {
			flex: 1;
			text-align: center;
			margin: 0 1.429rem;
			font-size: 1.3rem;
			color: #3f3d3d;
			@include displayOneLine;
		}
	}
	#VUE_transition {
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		align-content: flex-start;
		overflow-y: scroll;
		overflow-x: hidden;
		height: calc(100% - 2rem);
		margin-top: 1.429rem;
		@include hideScrollBar;
		.list-move {
			transition: transform 0.5s;
		}
		.list-leave-active {
			display: none;
		}
		.downloading {
			@include disabledStyle;
		}
		.books {
			height: auto;
			margin: 0.371rem 0;
			width: calc(33% - 0.57733333rem);
			position: relative;
			.mark {
				position: absolute;
				width: 100%;
				height: calc(100% - 2.714rem);
				background-color: rgba(0, 0, 0, 0.4);
				.progress {
					position: absolute;
					top: 40%;
					left: 50%;
					transform: translate(-50%);
					color: #03ff27;
					font-size: 1.8rem;
					white-space: nowrap;
				}
			}
			.commonItem {
				width: 100%;
				height: auto;
				.cover {
					width: 100%;
					height: auto;
					margin-bottom: 0.314rem;
					@include bookFartherStyle;
					img {
						@include bookStyle;
					}
				}
				.author {
					@include displayMultiline();
					height: 2.4rem;
					text-align: center;
				}
				.selectBtn {
					position: absolute;
					bottom: 2.186rem;
					right: -0.207rem;
					:deep(.van-badge__wrapper) {
						transition: color $transition, background-color $transition;
						padding: 0.214rem;
						color: white;
						background-color: rgba(0, 0, 0, 0.7);
						border-radius: 50%;
					}
				}
				.selected {
					:deep(.van-badge__wrapper) {
						color: #e5f802;
						background-color: red;
					}
				}
			}
		}
		.books:not(:nth-child(3n)) {
			margin-right: 0.871rem;
		}
	}
}
.show_group_detail {
	bottom: 0;
}
</style>
