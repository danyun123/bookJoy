<template>
	<div class="root">
		<Description_head :title="props.text" right="查看更多" @rightSizeClick="viewAll" />
		<div class="list">
			<template v-for="item in props.data" :key="item.id">
				<div class="item" @click="() => itemClick(item)">
					<div class="cover">
						<img :src="item.cover" alt="封面加载错误" />
					</div>
					<div class="info">
						<div class="name">
							{{ item.fileName }}
						</div>
						<div class="author">
							{{ item.author }}
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import Description_head from "@/baseUI/description_head/index.vue";
import useHome from "@/store/home";
import { onBeforeMount } from "vue";
import { categoryText } from "@/utils/common";
import { useRouter } from "vue-router";

interface IProps {
	data: any;
	text: String;
}
const router = useRouter();
const homeStore = useHome();
const { fetchBookList } = homeStore;
onBeforeMount(() => {
	fetchBookList();
});
const props = defineProps<IProps>();
const viewAll = () => {
	router.push({
		path: `/sortBook/${props.data[0].category}`,
		query: {
			sort_name: `${categoryText(props.data[0].category)![0]}`
		}
	});
};
const itemClick = (book: any) => {
	router.push({
		path: `/bookDetail/${book.fileName}`,
		query: book
	});
};
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.root {
	padding: 0 $pagePadding;
	margin: 1.814rem 0;
	:deep(.title) {
		font-size: 1.25rem;
	}
	.list {
		overflow: scroll;
		margin-top: 0.714rem;
		display: flex;
		flex-wrap: nowrap;
		&::-webkit-scrollbar {
			width: 0;
			background-color: transparent;
		}
		.item {
			width: 33%;
			margin: 1.071rem 0.714rem 1.071rem 0;
			display: flex;
			flex-direction: column;
			.info {
				width: 70%;
				font-size: 1.1rem;
				margin-left: 10px;
				display: flex;
				flex-direction: column;
				.name {
					width: 100%;
					margin-bottom: 0.829rem;
					word-wrap: break-word;
					font-size: 1rem;
					@include displayMultiline();
					margin-top: 0.429rem;
				}
				.author {
					color: $themeGreyColor;
					font-size: 1rem;
					@include displayOneLine();
				}
			}
			.cover {
				width: 100%;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
	}
}
</style>
