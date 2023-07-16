<template>
	<div class="guessLike">
		<Description_head title="猜你喜欢" @rightSizeClick="changeBatch" />
		<div class="list">
			<TransitionGroup name="list">
				<template v-for="item in formatList" :key="item.id">
					<div class="item" @click="() => itemClick(item)">
						<div class="cover">
							<img :src="item.cover" alt="封面加载错误" />
						</div>
						<div class="info">
							<div class="name">
								{{ item.title }}
							</div>
							<div class="author">
								{{ item.author }}
							</div>
							<div class="moreInfo">
								<div class="related">
									阅读过 <span :style="{ color: '#605e5e', fontWeight: 600 }">{{ item.result }}</span> 的人都喜欢
								</div>
								<div class="percentage" v-if="item.percent">{{ Math.floor(item.percent * 100) }}%的人读过</div>
							</div>
						</div>
					</div>
				</template>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup lang="ts">
import Description_head from "@/baseUI/description_head/index.vue";
import { ref, watch } from "vue";
import { getRandomArr } from "@/utils/common";
import { useRouter } from "vue-router";

interface IProps {
	data: any;
}

const props = defineProps<IProps>();
const formatList = ref<any[]>();
watch([props], () => {
	formatList.value = props.data.slice(0, 3);
});
const changeBatch = () => {
	formatList.value = getRandomArr(props.data ?? [], 3);
};
const router = useRouter();
const itemClick = (book: any) => {
	router.push({
		path: `/bookDetail/${book.fileName}`
	});
};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";

.guessLike {
	margin-top: 10px;
	font-size: 1.1rem;
	padding: 0 $pagePadding;

	:deep(.title) {
		font-size: 1.25rem;
	}

	.list {
		margin-top: 0.714rem;
		display: flex;
		flex-direction: column;

		.list-enter-active,
		.list-leave-active,
		.list-enter-to {
			transition: all 0.8s ease;
			transform: translateX(-3.143rem);
		}

		.list-enter-from,
		.list-leave-to {
			opacity: 0;
			transform: translateX(30px);
		}

		.item {
			width: 100%;
			margin: 1.071rem 0;
			display: flex;

			.info {
				width: 70%;
				font-size: 1.1rem;
				margin-left: 10px;
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
				position: relative;

				.name {
					width: 100%;
					margin-bottom: 0.829rem;
					word-wrap: break-word;
					@include displayMultiline();
				}

				.author,
				.moreInfo {
					color: $themeGreyColor;
					font-size: 1rem;
				}

				.moreInfo {
					margin-top: 0.357rem;
					@include displayMultiline();
				}

				.percentage {
					position: absolute;
					color: #fc4242;
					bottom: 0;
					right: 0;
					background-color: #f5f7fa;
				}
			}

			.cover {
				width: 30%;
				height: 100%;

				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
