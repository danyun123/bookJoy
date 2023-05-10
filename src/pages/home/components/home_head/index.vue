<template>
	<div class="head">
		<div class="return">
			<van-icon name="arrow-left" />
		</div>
		<div class="title">书城</div>
		<div class="random"><van-icon name="guide-o" /></div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.head {
	margin-top: 0.714rem;
	display: flex;
	font-size: 1.2rem;
	justify-content: space-between;
	.return {
		margin-left: 0.714rem;
	}
	.random {
		margin-right: 0.714rem;
	}
}
</style>
