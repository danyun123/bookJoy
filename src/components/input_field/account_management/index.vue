<template>
	<div class="account_managerment">
		<div class="header">
			<Head_return @click="returnClick" />
			<span class="text">{{ text }}</span>
		</div>
		<div class="content">
			<div class="register" v-if="props.clickmanagermentType === 'register'">
				<van-form @submit="onSubmit">
					<van-cell-group inset>
						<van-field
							v-model="username"
							name="账号"
							label="账号"
							placeholder="账号"
							maxlength="16"
							show-word-limit
							clearable
							:rules="[{ validator: verifyUsername }]"
						/>
						<van-field
							v-model="password"
							type="password"
							name="密码"
							label="密码"
							placeholder="密码"
							autocomplete="true"
							clearable
							clickable
							:rules="[{ validator: verifyPassword }]"
						/>
						<van-field
							v-model="verifyPwd"
							type="password"
							name="确认密码"
							label="确认密码"
							placeholder="确认密码"
							autocomplete="true"
							clearable
							clickable
							:rules="[{ validator: verifySecondPassword }]"
						/>
					</van-cell-group>
					<div style="margin: 16px" :class="{ forbidSubmit: !allowSubmit }">
						<van-button round block type="primary" native-type="submit">注册</van-button>
					</div>
				</van-form>
			</div>
			<div class="forget" v-else></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Head_return from "@/baseUI/head_return/index.vue";
import { computed, ref } from "vue";
import { accountLoginRequest, accountRegisterRequest } from "@/service/login/login";
import { showToast } from "vant";

interface IProps {
	clickmanagermentType: string;
}

const emit = defineEmits(["returnClick", "signSuccess"]);

const props = defineProps<IProps>();
const username = ref<string>();
const password = ref<string>();
const verifyPwd = ref();
const allowSubmit = ref(false);

const returnClick = () => {
	emit("returnClick");
};

const text = computed(() => {
	switch (props.clickmanagermentType) {
		case "register":
			return "注册账号";
		case "forget":
			return "忘记密码";
	}
	return "";
});
const verifyUsername = (value: string | null | undefined) => {
	if (value?.trim() === "") {
		allowSubmit.value = false;
		return "请输入用户名";
	}
	if ((value as string).length >= 16) {
		allowSubmit.value = false;
		return "用户名应小于16个字符";
	}
};
const verifyPassword = (value: string | null | undefined) => {
	if (value === "") {
		allowSubmit.value = false;
		return "请输入密码";
	}
};

const verifySecondPassword = (value: string | null | undefined) => {
	if (value === "") {
		allowSubmit.value = false;
		return "请输入密码";
	}
	if (verifyPwd.value !== password.value) {
		return "两次密码不一致";
	}
	allowSubmit.value = true;
};
const onSubmit = async () => {
	const result = await accountRegisterRequest({ name: username.value!, password: password.value! });
	if (result.code === -1001) {
		username.value = "";
		password.value = "";
		verifyPwd.value = "";
		showToast({
			message: `该用户已存在！`,
			duration: 2000,
			closeOnClick: true
		});
	} else {
		returnClick();
		emit("signSuccess", username.value, password.value);
	}
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/common";

.account_managerment {
	position: absolute;
	height: 100vh;
	width: 100vw;
	background-color: #f5f5f5;
	box-sizing: border-box;
	padding: $pagePadding;

	.header {
		position: relative;

		.text {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			font-size: 1.1rem;
		}
	}

	.content {
		position: absolute;
		font-size: 1.1rem;
		top: 25%;
		text-align: center;
		transform: translateX(-4%);
		color: #363535;
		width: 100%;

		input {
			border: 0;
			border-bottom: 1px solid #888888;
			margin-left: 0.714rem;
			background-color: transparent;
			font-size: 1rem;
			color: #817c7c;
		}

		.password {
			margin: 1.671rem 0;
		}

		.input_head {
			display: inline-block;

			& > span {
				text-align: justify;
				text-align-last: justify;
				width: 4.5em;
				display: inline-block;
			}
		}
	}

	.forbidSubmit {
		@include disabledStyle;
	}
}
</style>
