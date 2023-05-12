<template>
	<div class="sort">
		<Description_head title="分类" right="查看全部" @rightSizeClick="viewAll" />
		<div class="list">
			<template v-for="(item, index) in props.data" :key="index">
				<div class="item" @click="() => bookClick(item.category)">
					<div class="box">
						<div class="info">
							<div class="title">{{ categoryText(item.category)[1] }}</div>
							<div class="num">{{ item.num }}本书</div>
						</div>
						<div class="img_wrapper">
							<div class="img_group">
								<img :src="item.img1" alt="图片加载失败" />
								<img :src="item.img2" alt="图片加载失败" />
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import Description_head from "@/baseUI/description_head/index.vue";
import { categoryText } from "@/utils/common";
import { useRouter } from "vue-router";

interface IProps {
	data: any;
}
const router = useRouter();
const props = defineProps<IProps>();
const viewAll = () => {
	router.push({
		path: `/sortBook/allBook`
	});
};
const bookClick = (category: number) => {
	router.push({
		path: `/sortBook/${category}`,
		query: {
			sort_name: `${categoryText(category)![0]}`
		}
	});
};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";

.sort {
	padding: 0 $pagePadding;
	margin: 1.814rem 0;
	:deep(.title) {
		font-size: 1.25rem;
	}
	.list {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		margin-top: 0.714rem;
		.item {
			width: calc(50% - 0.358rem);
			margin: 0.357rem 0;
			background-color: #d7d4d4;
			height: 10.714rem;
			.box {
				position: relative;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;
				height: 100%;
				.info {
					position: absolute;
					top: 30%;
					left: 0.714rem;
					transform: translateY(-50%);
					text-align: center;
					.num {
						font-size: 0.9rem;
						color: $themeGreyColor;
					}
				}
				.img_wrapper {
					position: absolute;
					right: 0.714rem;
					top: 50%;
					transform: translateY(-50%);
					width: 50%;
					.img_group {
						img {
							position: absolute;
							width: 4.286rem;
							height: 4.286rem;
							right: 0;
						}
						img:first-child {
							top: -0.714rem;
							right: 1.429rem;
							z-index: 1110;
							width: 5rem;
							height: 5.714rem;
						}
					}
				}
			}
		}
		.item:nth-child(2n - 1) {
			margin-right: 0.714rem;
		}
	}
}
</style>
