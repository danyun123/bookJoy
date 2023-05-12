<template>
	<div class="own">
		<div class="title">
			<img :src="ownData.avatarUrl" alt="图片显示错误" />
			<div class="name">{{ ownData.username }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const ownData = reactive({
	id: 1,
	username: "梅理猫",
	userAccount: "danyun",
	avatarUrl: "https://img.zcool.cn/community/0110685f83d17511013f3110cb2adf.jpg"
});
</script>

<style scoped lang="scss">
.own {
	.title {
		text-align: center;
		margin-top: 20px;
		img {
			width: 80px;
			height: 80px;
			border-radius: 50%;
		}
		.name {
			font-size: 20px;
		}
	}
}
</style>
