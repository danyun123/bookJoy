<template>
	<div class="tabbar">
		<div class="list">
			<div class="home item" @click="() => itemClick('home')">首页</div>
			<div class="bookshelf item" @click="() => itemClick('bookshelf')">书架</div>
			<div class="own item" @click="() => itemClick('own')">我的</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const itemClick = (page: string) => {
	router.push(`${page}`);
};
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.list {
	position: fixed;
	bottom: -1px;
	width: 100%;
	padding: 0.714rem 0;
	background-color: rgba(255, 255, 255, 0.95);
	box-shadow: $boxShadow;
	border-top-left-radius: 1.071rem;
	border-top-right-radius: 1.071rem;
	display: flex;
	justify-content: space-around;
	color: $themeColor;
	.item {
		@include clickActiveAnimation();
		padding: 0.21rem;
	}
}
</style>
