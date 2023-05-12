<template>
	<div class="featured">
		<Description_head title="精选" right="" />
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
import { useRouter } from "vue-router";

interface IProps {
	data: any;
}
const props = defineProps<IProps>();
const router = useRouter();
const itemClick = (book: any) => {
	router.push({
		path: `/bookDetail/${book.fileName}`,
		query: book
	});
};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";
.featured {
	padding: 0 $pagePadding;
	margin: 1.814rem 0;
	:deep(.title) {
		font-size: 1.25rem;
	}
	.list {
		margin-top: 0.714rem;
		display: flex;
		flex-wrap: wrap;
		.item {
			width: 50%;
			margin: 1.071rem 0;
			display: flex;
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
				}
				.author {
					color: $themeGreyColor;
					font-size: 1rem;
					@include displayMultiline();
				}
			}
			.cover {
				width: 30%;
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
