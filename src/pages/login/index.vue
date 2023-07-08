<template>
	<div class="login">
		<div class="text">书悦</div>
		<Input_field class="login_input_field" />
	</div>
</template>

<script setup lang="ts">
import Input_field from "@/components/input_field/index.vue";
</script>

<style scoped lang="scss">
.login {
	height: 100vh;
	background: url("https://danyun.oss-cn-chengdu.aliyuncs.com/27584707_0_final.png") no-repeat center center fixed;
	background-size: cover;
	display: flex;
	justify-content: center;
	align-items: center;

	.text {
		position: absolute;
		top: 12%;
		font-size: 3rem;
		color: white;
		letter-spacing: 1em;
		text-align: center;
		transform: translateX(0.5em);
		-webkit-mask-image: -webkit-gradient(linear, 0 0, 0 bottom, from(yellow), to(rgba(0, 0, 255, 0)));
	}

	.login_input_field {
	}
}
</style>
