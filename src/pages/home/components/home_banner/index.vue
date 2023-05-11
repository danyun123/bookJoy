<template>
	<div class="banner">
		<img :src="props.banner" alt="图片加载错误" />
	</div>
</template>

<script setup lang="ts">
// import axios from "axios";

interface IProps {
	banner: String;
}
const props = defineProps<IProps>();

// axios
// 	.post("http://47.109.55.63/login", {
// 		name: "why",
// 		password: "123456"
// 	})
// 	.then((res) => {
// 		console.log(res);
// 	});
</script>

<style scoped lang="scss">
.banner {
	img {
		width: 100%;
		height: 100%;
	}
}
</style>
