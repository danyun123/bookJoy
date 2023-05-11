<template>
	<div class="recommend">
		<Description_head title="热门推荐" right="查看全部" @rightSizeClick="viewAll" />
		<div class="list">
			<template v-for="item in props.data" :key="item.id">
				<div class="item">
					<div class="cover">
						<img :src="item.cover" alt="图片加载错误" />
					</div>
					<div class="name">
						{{ item.fileName }}
					</div>
					<div class="readersNum">{{ item.readers }}人同时在读</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import Description_head from "@/baseUI/description_head/index.vue";

interface IProps {
	data: any;
}
const props = defineProps<IProps>();
const viewAll = () => {
	console.log(545);
};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";

.recommend {
	padding: 0 $pagePadding;
	margin: 0.714rem 0;
	:deep(.title) {
		font-size: 1.25rem;
	}
	.list {
		display: flex;
		margin-top: 1.814rem;
		.item {
			width: 33%;
			.cover {
				width: 100px;
				height: 80%;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.name {
				width: 100%;
				word-wrap: break-word;
				@include displayMultiline();
				text-align: center;
			}
			.readersNum {
				text-align: center;
				margin-top: 0.429rem;
				color: $themeGreyColor;
				font-size: 0.92rem;
			}
			.cover {
				width: 100%;
			}
		}
		.item:nth-child(2) {
			margin: 0 6px;
		}
	}
}
</style>
