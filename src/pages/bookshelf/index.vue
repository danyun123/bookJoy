<template>
	<div class="allBookshelfRelated">
		<div class="bookshelf">
			<div class="head">
				<div
					:class="{
						selectAll: true,
						textInit: true,
						textDisplay: isEditing && (currentPage === 'bookshelf' || currentPage === 'download')
					}"
					@click="selectAll"
				>
					{{ isSelectAll ? "取消全选" : "全选" }}
				</div>
				<div class="title">
					<div :class="{ shelf: true, isSelected: currentPage === 'bookshelf' }" @click="changePage('bookshelf')">
						{{ isEditing && currentPage === "bookshelf" && currentPage === "bookshelf" ? "编辑书架" : "书架" }}
					</div>
					<i style="width: 0; height: 1.5rem; border: 1px solid #8d8787"></i>
					<div :class="{ load: true, isSelected: currentPage === 'download' }" @click="changePage('download')">
						{{ isEditing && currentPage === "download" ? "编辑下载" : "下载" }}
					</div>
				</div>
				<div
					class="edit"
					@click="isEditing = !isEditing"
					v-if="
						(booksList.length > 0 && currentPage === 'bookshelf') ||
						(downloadOverBooks.length > 0 && currentPage === 'download')
					"
				>
					<span v-if="isEditing && currentPage === 'bookshelf'">完成</span>
					<span v-else>编辑</span>
				</div>
			</div>
			<div :class="{ allPageBox: true, pageIsDownload: currentPage === 'download' }">
				<div class="content">
					<TransitionGroup name="list" id="VUE_transition" tag="div">
						<div v-for="item in booksList" :key="item.fileName" class="books">
							<div class="commonItem item" @click.stop="() => bookClick(item)" v-if="!item.type">
								<div class="cover">
									<img :src="item.cover" alt="图片加载错误" />
								</div>
								<div class="author">
									{{ item.author }}
								</div>
								<div
									:class="{ selectBtn: true, selected: selectedBooks.find((i) => i.fileName === item.fileName) }"
									v-if="isEditing"
									@click.stop=""
								>
									<van-icon name="success" />
								</div>
							</div>
							<div class="groupItem item" @click.stop="() => bookClick(item)" v-else-if="item.bookList.length > 0">
								<Display_group :bookData="item" />
								<div
									:class="{
										selectBtn: true,
										selected: currentPage === 'bookshelf' && selectedBooks.find((i) => i.fileName === item.fileName)
									}"
									v-if="isEditing"
									@click.stop=""
								>
									<van-icon name="success" />
								</div>
							</div>
						</div>
					</TransitionGroup>
					<div class="remind" v-if="booksList.length === 0 && currentPage === 'bookshelf'">
						您还未收藏电子书，快去逛逛吧！
					</div>
				</div>
				<Download
					class="download"
					:allBooks="flatSelectBooks(booksList)"
					:downloadProgress="downloadProgress"
					:selectedBooks="flatSelectBooks(selectedBooks)"
					:assistDownload="assistDownload"
				/>
			</div>

			<Bookshelf_tabbar
				:class="{ textInit: !isEditing, textDisplay: isEditing }"
				:haveSelected="
					selectedBooks.length > 0 || downloadPageSelectedList.length > 0 || groupDetailSelectedList.length > 0
				"
				@downloadClick="downloadClick"
				@groupingClick="groupingClick"
				@deleteClick="deleteClick"
				@removeGroupClick="removeGroupClick"
			/>
			<div class="dialog">
				<component
					:is="dialogCpm"
					@groupItemClick="groupItemClick"
					@closeDialog="closeDialog"
					:selectedBooks="flatSelectBooks(selectedBooks)"
					:bookList="booksList"
				/>
			</div>
		</div>
		<GroupDetail />
	</div>
</template>
<script setup lang="ts">
import Bookshelf_tabbar from "@/components/bookshelf_tabbar/index.vue";
import type { Component } from "vue";
import { markRaw, onActivated, ref, watch, watchEffect } from "vue";
import { ALLBOOKSHELFNAME, BOOKSHELF, DOWN_LOAD_OVER_BOOKS } from "@/assets/constant";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router/dist/vue-router";
import { storeToRefs } from "pinia/dist/pinia";
import type { groupDataListType } from "@/store/bookshelf";
import useBookshelf from "@/store/bookshelf";
import Grouping from "./components/grouping/index.vue";
import Download from "./components/download/index.vue";
import GroupDetail from "./components/group_detail/index.vue";
import Display_group from "./components/display_group/index.vue";
import { flatSelectBooks } from "@/utils/bookshelf";
import { download } from "@/service/bookshelf";
import { showToast } from "vant";
import { removeLocalForage } from "@/utils/localForage";

const groupNameExtraConstant = "123456789";
const router = useRouter();
const route = useRoute();
const { currentPage } = storeToRefs(useBookshelf());
const { downloadPageSelectedList, isEditing, groupDetailSelectedList, groupDetailData, downloadOverBooks } =
	storeToRefs(useBookshelf());
const selectedBooks = ref<any[]>([]);
const downloadBooks = ref<any[]>([]);
const assistDownload = ref(false);
const isSelectAll = ref(false);
const downloadProgress = ref<{ fileName: string; progress: number }[]>([]);
const dialogCpm = ref<Component | null>(null);
const booksList = ref(JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]"));
const changePage = (pageName: "bookshelf" | "download") => {
	currentPage.value = pageName;
	isEditing.value = false;
};

const selectAll = () => {
	if (!isSelectAll.value) {
		if (currentPage.value === "bookshelf") {
			selectedBooks.value = booksList.value;
		} else {
			downloadPageSelectedList.value = JSON.parse(localStorage.getItem(DOWN_LOAD_OVER_BOOKS) ?? "[]");
		}
	} else {
		if (currentPage.value === "bookshelf") {
			selectedBooks.value = [];
		} else {
			downloadPageSelectedList.value = [];
		}
	}
	isSelectAll.value = !isSelectAll.value;
};
const groupDetailRemoveFun = () => {
	const index = booksList.value.findIndex(
		(item: any) => item.name === (groupDetailData.value as groupDataListType).name
	);
	groupDetailSelectedList.value.forEach((item) => {
		const groupIndex = booksList.value[index].bookList.findIndex((i: any) => item.fileName === i.fileName);
		if (groupIndex !== -1) booksList.value[index].bookList.splice(groupIndex, 1);
	});
	if (booksList.value[index].bookList.length === 0) {
		booksList.value.splice(index, 1);
		(groupDetailData.value as groupDataListType).bookList = [];
	}
};

// 移出分组
const removeGroupClick = () => {
	groupDetailRemoveFun();
	const formatArr = groupDetailSelectedList.value;
	booksList.value = formatArr.concat(booksList.value);
	groupDetailSelectedList.value = [];
	isEditing.value = false;
};
const bookClick = (data: any) => {
	if (isEditing.value) {
		if (selectedBooks.value.find((item: any) => item.fileName === data.fileName)) {
			selectedBooks.value.splice(
				selectedBooks.value.findIndex((item) => item.fileName === data.fileName),
				1
			);
		} else {
			selectedBooks.value.unshift(data);
		}
	} else if (!data.type) {
		router.push({
			path: `/bookDetail/${data.fileName}`
		});
	}
};
const updateProgress = (name: string, progress: number) => {
	assistDownload.value = !assistDownload.value;
	const i = downloadProgress.value.findIndex((item) => item.fileName === name);
	if (i !== -1) downloadProgress.value[i].progress = progress;
};
const downloadBookFun = async (book: any, index: number) => {
	await download(
		book,
		() => {
			downloadBooks.value.splice(index, 1);
			const nowDownloadOverBooks = JSON.parse(localStorage.getItem(DOWN_LOAD_OVER_BOOKS) ?? "[]");
			localStorage.setItem(DOWN_LOAD_OVER_BOOKS, JSON.stringify([...nowDownloadOverBooks, book]));
		},
		() => {
			downloadBooks.value.splice(index, 1);
			showToast({
				message: `${book.title} 下载失败！请重试`,
				duration: 3000,
				closeOnClick: true,
				position: "top"
			});
		},
		(event?: any) => {
			const percentage = Math.floor((event.loaded / event.total) * 100);
			if (downloadBooks.value[index]) downloadBooks.value[index].percentage = percentage;
			updateProgress(book.fileName, percentage);
		}
	);
};
const removeDownLoad = (name: string) => {
	return new Promise((resolve) => {
		removeLocalForage(name);
		resolve(booksList);
	});
};
const downloadClick = () => {
	let data: any[] = [];
	switch (currentPage.value) {
		case "bookshelf":
			data = selectedBooks.value;
			break;
		case "groupDetail":
			data = groupDetailSelectedList.value;
			break;
	}
	showToast({
		message: `开始下载所选书籍`,
		duration: 1000,
		closeOnClick: true,
		position: "top"
	});
	flatSelectBooks(data).forEach((book) => {
		const downloadOverBooks = JSON.parse(localStorage.getItem(DOWN_LOAD_OVER_BOOKS) ?? "[]");
		if (
			downloadOverBooks.findIndex((item: any) => item.fileName === book.fileName) !== -1 ||
			downloadBooks.value.includes(book.title)
		) {
			showToast({
				message: `${book.title} 已经下载或正在下载`,
				duration: 2000,
				closeOnClick: true,
				position: "top"
			});
			return;
		}
		downloadProgress.value.push({ fileName: book.fileName, progress: 0 });
		downloadBooks.value.push({ ...book, percentage: 0 });
		const index = downloadBooks.value.length - 1;
		downloadBookFun(book, index).then(() => {
			downloadProgress.value = [];
		});
	});
};
const deleteClick = () => {
	if (currentPage.value === "bookshelf") {
		const names = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
		selectedBooks.value.forEach((item) => {
			const index = booksList.value.findIndex((book: any) => item.fileName === book.fileName);
			if (booksList.value[index].type === "group") {
				booksList.value[index].bookList.forEach((i: any) => {
					const namesIndex = names.findIndex((key: any) => key === i);
					names.splice(namesIndex, 1);
				});
			} else {
				const namesIndex = names.findIndex((key: any) => key === booksList.value[index].fileName);
				names.splice(namesIndex, 1);
			}
			booksList.value.splice(index, 1);
		});
		showToast({
			message: `删除成功`,
			duration: 1000,
			closeOnClick: true,
			position: "top"
		});
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify(names));
	} else if (currentPage.value === "download") {
		Promise.all(
			downloadPageSelectedList.value.map((item) => {
				removeDownLoad(item.fileName);
			})
		).then(() => {
			const downloadBooks = JSON.parse(localStorage.getItem(DOWN_LOAD_OVER_BOOKS) ?? "[]");
			downloadPageSelectedList.value.forEach((book) => {
				const index = downloadBooks.findIndex((item: any) => item.fileName === book.fileName);
				if (index !== -1) downloadBooks.splice(index, 1);
			});
			showToast({
				message: `删除成功`,
				duration: 1000,
				closeOnClick: true,
				position: "top"
			});
			localStorage.setItem(DOWN_LOAD_OVER_BOOKS, JSON.stringify(downloadBooks) ?? "[]");
			downloadPageSelectedList.value = [];
			assistDownload.value = !assistDownload.value;
		});
	} else if (currentPage.value === "groupDetail") {
		groupDetailRemoveFun();
		const allBooksName = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
		groupDetailSelectedList.value.forEach((book) => {
			allBooksName.splice(
				allBooksName.findIndex((item: string) => book.fileName === item),
				1
			);
		});
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify(allBooksName));
		groupDetailSelectedList.value = [];
		showToast({
			message: `删除成功`,
			duration: 1000,
			closeOnClick: true,
			position: "top"
		});
	}
};
const deleteBooksToGroup = (currentGroup?: string) => {
	selectedBooks.value.forEach((book) => {
		if (book.fileName === currentGroup) {
			const index = booksList.value.findIndex((item: any) => item.fileName === currentGroup);
			booksList.value[index].bookList = [];
			return;
		}
		const index = booksList.value.findIndex((item: any) => item.fileName === book.fileName);
		if (index !== -1) booksList.value.splice(index, 1);
	});
};

const deleteBooksFromGroupDetail = (groupName?: string) => {
	const name = (groupDetailData.value as groupDataListType).name;
	if (groupName && groupName === name) return;
	const groupIndex = booksList.value.findIndex((i: any) => i.name === name);
	groupDetailSelectedList.value.forEach((item) => {
		booksList.value[groupIndex].bookList.splice(
			booksList.value[groupIndex].bookList.findIndex((book: any) => book.fileName === item.fileName),
			1
		);
	});
	if (booksList.value[groupIndex].bookList.length === 0) booksList.value.splice(groupIndex, 1);
};

const newGroupFun = (newGroupName: string, bookList: any[]) => {
	booksList.value.push({
		fileName: newGroupName + groupNameExtraConstant,
		type: "group",
		name: newGroupName,
		bookList: bookList
	});
	isEditing.value = false;
};
// 新建分组确认或取消
const closeDialog = (newGroupName: string) => {
	if (newGroupName.length > 0 && currentPage.value === "bookshelf") {
		deleteBooksToGroup();
		newGroupFun(newGroupName, selectedBooks.value);
		selectedBooks.value = [];
	} else if (newGroupName.length > 0 && currentPage.value === "groupDetail") {
		deleteBooksFromGroupDetail();
		newGroupFun(newGroupName, groupDetailSelectedList.value);
		groupDetailSelectedList.value = [];
	}
	dialogCpm.value = null;
};
const groupingClick = () => {
	dialogCpm.value = markRaw(Grouping);
};
// 将所选书籍移动到所选分组
const groupItemClick = (groupName: string) => {
	const newBooks: any[] =
		currentPage.value === "bookshelf" ? [...flatSelectBooks(selectedBooks.value)] : [...groupDetailSelectedList.value];
	let index: number = booksList.value.findIndex((item: any) => item.fileName === groupName + groupNameExtraConstant);
	if (currentPage.value === "bookshelf") {
		deleteBooksToGroup(groupName + groupNameExtraConstant);
		// 修改了结构所以要重新获取!!!
		index = booksList.value.findIndex((item: any) => item.fileName === groupName + groupNameExtraConstant);
	} else if (currentPage.value === "groupDetail") {
		deleteBooksFromGroupDetail(groupName);
		(groupDetailData.value as groupDataListType).bookList = [];
	}
	if (index !== -1) booksList.value[index].bookList = booksList.value[index].bookList.concat(newBooks);
	isEditing.value = false;
};
onActivated(() => {
	isEditing.value = false;
	if (route.path === "/bookshelf") {
		booksList.value = JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]");
	}
});
watch([isEditing], () => {
	selectedBooks.value = [];
	dialogCpm.value = null;
	isSelectAll.value = false;
});
watchEffect(() => {
	localStorage.setItem(BOOKSHELF, JSON.stringify(booksList.value));
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.textInit {
	@include textDisplayInit;
}

.textDisplay {
	@include textDisplayOver;
}

.bookshelf {
	padding: 0 $pagePadding;
	height: 100vh;
	width: auto;
	overflow-x: visible;

	.head {
		width: calc(100%);
		position: fixed;
		top: 0;
		padding-top: 1.014rem;
		height: 2rem;
		margin-left: -$pagePadding;
		z-index: 2;
		background: linear-gradient(to right, #efbec3, #e7e7e7);

		.title {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			font-size: 1.2rem;
			display: flex;
			align-items: center;

			.isSelected {
				border-bottom: 0.221rem solid #25d9d3;
				border-radius: 2px;
				color: black !important;
			}

			.shelf {
				display: inline-block;
				padding: 0 0.257rem 0.25rem 0.257rem;
				margin-right: 0.3rem;
				transition: background-color $transition, border-bottom $transition, color $transition;
				color: #6e6a6a;
				box-sizing: border-box;
			}

			.load {
				display: inline-block;
				padding: 0 0.275rem 0.25rem 0.257rem;
				margin-left: 0.3rem;
				transition: background-color $transition, border-bottom $transition;
				color: #6e6a6a;
				box-sizing: border-box;
			}
		}

		.selectAll {
			position: absolute;
			left: $pagePadding;
			color: $themeColor;
			@include clickActiveAnimation;
		}

		.edit {
			position: absolute;
			right: $pagePadding;
			font-size: 1rem;
			color: $themeColor;
			@include clickActiveAnimation;
		}
	}

	.allPageBox {
		width: calc(2 * 100vw);
		display: flex;
		transform: translateX(0);
		transition: transform $transition;
		height: calc(100% - 6.8rem);
		margin-top: 3.514rem;
		overflow-x: visible;

		.content {
			height: 100%;
			width: calc(100vw - 2 * #{$pagePadding});
			overflow-x: visible;

			#VUE_transition {
				display: flex;
				flex-wrap: wrap;
				align-items: stretch;
				align-content: flex-start;
				overflow-y: scroll;
				overflow-x: hidden;
				height: 100%;
				@include hideScrollBar;

				.list-move {
					transition: transform 0.5s;
				}

				.list-leave-active {
					display: none;
				}

				.books {
					height: auto;
					margin: 0.371rem 0;
					width: calc(33% - 0.57733333rem);
					position: relative;

					.item {
						width: 100%;
						height: auto;
					}

					.commonItem {
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
							z-index: 11;
							bottom: 2.186rem;
							right: -0.207rem;

							:deep(.van-badge__wrapper) {
								transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
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

					.groupItem {
						:deep(.van-badge__wrapper) {
							transition: color $transition, background-color $transition;
							padding: 0.214rem;
							color: white;
							background-color: rgba(0, 0, 0, 0.7);
							border-radius: 50%;
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

			.remind {
				@include remindInfo;
				right: calc(-38%);
			}
		}

		.download {
			width: calc(100vw - 2 * #{$pagePadding});
			margin-left: calc(2 * #{$pagePadding});
		}
	}

	.pageIsDownload {
		transform: translateX(-100vw);
	}
}
</style>
