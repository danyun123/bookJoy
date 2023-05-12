<template>
	<div class="head">
		<div class="title">{{ props.title }}</div>
		<div class="right" @click="rightClick">{{ props.right ?? "换一批" }}</div>
	</div>
</template>

<script setup lang="ts">
interface IProps {
	title: string;
	right?: string;
}
const props = defineProps<IProps>();
const emit = defineEmits(["rightSizeClick"]);
const rightClick = () => {
	emit("rightSizeClick");
};
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.head {
	display: flex;
	justify-content: space-between;
	align-content: center;
	flex-wrap: wrap;
	font-size: 1rem;
	font-weight: 600;
	.right {
		color: $themeColor2;
		transform: translateY(15%);
		@include clickActiveAnimation();
	}
}
</style>
