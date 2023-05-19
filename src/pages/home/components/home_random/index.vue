<template>
	<div class="recommend_card">
		<div class="mask"></div>
		<div class="recommend_card_content">
			<div class="book">
				<div class="text">为您推荐</div>
				<div class="cover">
					<img :src="bookInfo?.cover" alt="图片记载错误" />
				</div>
				<div class="name">{{ bookInfo?.title }}</div>
				<div class="author">{{ bookInfo?.author }}</div>
			</div>
			<div class="cancel" @click.stop="showRecommendCard = false"><van-icon name="cross" /></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia/dist/pinia";
import useHome from "@/store/home";
import { reactive, watchEffect } from "vue";

interface IPropsType {
	data: any[];
}
const props = defineProps<IPropsType>();
const { showRecommendCard, RecommendCardBookIndex } = storeToRefs(useHome());
let bookInfo = reactive([]);
watchEffect(() => {
	if (props.data.length > 0 && RecommendCardBookIndex) {
		bookInfo = reactive(props.data[RecommendCardBookIndex.value as number] ?? []);
	}
});
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";
.recommend_card {
	position: absolute;
	z-index: 10;
	display: grid;
	place-items: center;
	.mask {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.2);
	}
	.recommend_card_content {
		width: 70%;
		height: 45%;
		position: fixed;
		z-index: 11;
		top: 20%;
		background-color: #e7e7e7;
		border-radius: 15px;
		.book {
			height: 100%;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			.text {
				margin-bottom: 0.714rem;
				font-size: 1.2rem;
				color: $themeColor;
				padding-top: 0.714rem;
			}
			.cover {
				width: 50%;
				height: 55%;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.name {
				text-align: center;
				font-size: 1.4rem;
				margin-top: 0.357rem;
				@include displayMultiline();
			}
			.author {
				margin-top: 0.357rem;
				text-align: center;
				color: $themeGreyColor;
				@include displayMultiline();
			}
		}
		.cancel {
			position: absolute;
			bottom: -25%;
			left: 50%;
			transform: translateX(-50%);
			font-size: 2.5rem;
			font-weight: 700;
			border-radius: 50%;
			:deep(.van-badge__wrapper) {
				color: #dddddd;
				background-color: #212121;
				padding: 0.214rem;
				border-radius: 50%;
			}
		}
	}
}
</style>
