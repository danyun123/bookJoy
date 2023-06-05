<template>
	<div class="return" @click="router.back()">
		<van-icon name="arrow-left" />
		<span>返回</span>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.return {
	display: inline-block;
	margin-left: -0.414rem;
	font-size: 1.2rem;
	color: $themeColor;
}
</style>
