<template>
	<div class="download">
		<div class="download_content">
			<TransitionGroup name="list" id="VUE_transition" tag="div" v-if="allBooks.length > 0">
				<div
					v-for="item in allBooks"
					:key="item.fileName"
					:class="{ books: true, downloading: getProgress(item.fileName) !== 100 }"
				>
					<div class="mark" v-if="getProgress(item.fileName) !== 100">
						<div class="progress">{{ getProgress(item.fileName) }} %</div>
					</div>
					<div class="commonItem" @click="() => bookClick(item)">
						<div class="cover">
							<img :src="item.cover" alt="图片加载错误" />
						</div>
						<div class="author">
							{{ item.author }}
						</div>
						<div
							:class="{ selectBtn: true, selected: downloadPageSelectedList.find((i) => i.fileName === item.fileName) }"
							v-if="isEditing"
							@click.stop=""
						>
							<van-icon name="success" />
						</div>
					</div>
				</div>
			</TransitionGroup>
			<div class="downloadNoone" v-else-if="currentPage === 'download'">未下载任何资源</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { DOWN_LOAD_OVER_BOOKS } from "@/assets/constant";
import throttle from "@/utils/throttle";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia/dist/pinia";
import useBookshelf from "@/store/bookshelf";

interface IProps {
	downloadProgress: { name: string; progress: number }[];
	assistDownload: boolean;
	allBooks: any[];
	selectedBooks: any[];
}

const { currentPage, downloadPageSelectedList, isEditing, downloadOverBooks } = storeToRefs(useBookshelf());
const props = defineProps<IProps>();
const router = useRouter();
const allBooks = ref<any[]>(JSON.parse(localStorage.getItem(DOWN_LOAD_OVER_BOOKS) ?? "[]"));
const bookClick = (data: any) => {
	if (isEditing.value) {
		const index = downloadPageSelectedList.value.findIndex((item) => item.fileName === data.fileName);
		if (downloadPageSelectedList.value.find((item: any) => item.fileName === data.fileName)) {
			if (index !== -1) downloadPageSelectedList.value.splice(index, 1);
		} else {
			downloadPageSelectedList.value.unshift(data);
		}
		return;
	}
	router.push({
		path: `/bookDetail/${data.fileName}`
	});
};
const getProgress = (name: string) => {
	const index = props.downloadProgress.findIndex((book) => book.name === name);
	return index !== -1
		? isNaN(props.downloadProgress[index].progress)
			? 100
			: props.downloadProgress[index].progress
		: 100;
};

const progress = computed(() => {
	return allBooks.value.map((book) => getProgress(book.fileName));
});
const allBookPush = (item: any) => {
	if (!allBooks.value.some((i) => i.fileName === item.fileName)) allBooks.value.push(item);
};
watch(
	[props],
	throttle(() => {
		if (!isEditing) downloadPageSelectedList.value = [];
		allBooks.value = [];
		const downLoadOverBooks = JSON.parse(localStorage.getItem(DOWN_LOAD_OVER_BOOKS) ?? "[]");
		props.selectedBooks.forEach((item: any) => {
			if (allBooks.value.findIndex((i) => item.fileName === i.fileName) !== -1) return;
			allBookPush(item);
		});
		props.downloadProgress.forEach((item) => {
			if (allBooks.value.findIndex((i) => i.fileName === item.name) !== -1) return;
			const index = props.allBooks.findIndex((books) => item.name === books.fileName);
			if (index !== -1) {
				allBookPush(props.allBooks[index]);
			}
		});
		downLoadOverBooks.forEach((item: any) => {
			if (allBooks.value.findIndex((i) => item.fileName === i.fileName) !== -1) return;
			allBookPush(item);
		});
		downloadOverBooks.value = allBooks.value;
	}, 444)
);
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";

.download {
	.download_content {
		height: 100%;

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

		.downloadNoone {
			@include remindInfo;
			left: calc(50% + 50vw - #{$pagePadding});
		}
	}
}
</style>
