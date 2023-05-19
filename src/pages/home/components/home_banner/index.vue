<template>
	<div class="banner">
		<img :src="props.banner" alt="图片加载错误" />
	</div>
</template>

<script setup lang="ts">
interface IProps {
	banner: String;
}
const props = defineProps<IProps>();
</script>

<style scoped lang="scss">
.banner {
	margin-top: calc(24px + 2.242rem);
	img {
		width: 100%;
		height: 100%;
	}
}
</style>
