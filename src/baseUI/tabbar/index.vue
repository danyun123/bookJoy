<template>
	<div class="tabbar" :style="{ display: isEditing ? 'none' : 'block' }" v-if="!refresh">
		<div class="list">
			<div :class="{ home: true, item: true, isActive: currentPage === 'home' }" @click="() => itemClick('home')">
				<van-icon name="wap-home-o" />
				<span>首页</span>
			</div>
			<div
				:class="{ bookshelf: true, item: true, isActive: currentPage === 'bookshelf' }"
				@click="() => itemClick('bookshelf')"
			>
				<van-icon class="iconfont" class-prefix="icon" name="shujia" />
				<span>书架</span>
			</div>
			<div :class="{ own: true, item: true, isActive: currentPage === 'own' }" @click="() => itemClick('own')">
				<van-icon name="manager-o" />
				<span>我的</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router/dist/vue-router";
import { storeToRefs } from "pinia/dist/pinia";
import useBookshelf from "@/store/bookshelf";

type pageType = "home" | "bookshelf" | "own";

const router = useRouter();
const route = useRoute();
const refresh = ref(false);
const { isEditing } = storeToRefs(useBookshelf());
const currentPage = ref<pageType>("home");
const itemClick = (page: pageType) => {
	currentPage.value = page;
	router.push(`${page}`);
};
watchEffect(() => {
	currentPage.value = route.path.split("/")[1] as pageType;
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.list {
	position: fixed;
	bottom: -1px;
	width: 100%;
	padding: 0.314rem 0;
	background-color: rgba(255, 255, 255, 0.95);
	box-shadow: $boxShadow;
	border-top-left-radius: 1.071rem;
	border-top-right-radius: 1.071rem;
	display: flex;
	justify-content: space-around;
	color: $themeColor;
	min-width: $minWidth;

	.item {
		padding: 0.21rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 2.857rem;
		height: 2.857rem;
		box-sizing: border-box;
		transition: all $transition;

		& > span {
			margin-top: 0.357rem;
		}
	}

	.isActive {
		background-color: #52f6ee;
		border-radius: 50%;
		transform: translateY(-20%);
		scale: 0.9;
		box-shadow: 0 0.286rem 0.286rem 0.143rem #3fcdf8;
	}
}
</style>
