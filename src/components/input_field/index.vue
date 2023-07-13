<template>
	<div class="input_field">
		<van-form @submit="onSubmit">
			<van-cell-group inset>
				<van-field
					v-model="username"
					name="账号"
					label="账号"
					placeholder="账号"
					clearable
					clickable
					maxlength="16"
					show-word-limit
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
			</van-cell-group>
			<div class="login_cpm">
				<div class="registerAccount" @click="() => managermentClick('register')">注册账号</div>
				<!--				<div class="forgetPwd" @click="() => managermentClick('forget')">忘记密码</div>-->
			</div>
			<div style="margin: 16px">
				<van-button round block type="primary" native-type="submit">登录</van-button>
			</div>
		</van-form>
	</div>
	<div :class="{ management: true, showManagement: showManagement }">
		<Account_managerment
			:clickmanagermentType="clickmanagermentType"
			@returnClick="showManagement = false"
			@signSuccess="signSuccess"
		/>
	</div>
</template>

<script setup lang="ts">
import { onDeactivated, ref } from "vue";
import Account_managerment from "@/components/input_field/account_management/index.vue";
import { accountLoginRequest } from "@/service/login/login";
import { showToast } from "vant";
import { useRouter } from "vue-router";

type managermentType = "forget" | "register";

const allowSubmit = ref(false);
const username = ref("");
const password = ref("");
const showManagement = ref(false);
const clickmanagermentType = ref<managermentType>("forget");
const router = useRouter();

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
	allowSubmit.value = true;
};
const managermentClick = (type: managermentType) => {
	switch (type) {
		case "forget":
			clickmanagermentType.value = "forget";
			break;
		case "register":
			clickmanagermentType.value = "register";
			break;
	}
	showManagement.value = true;
};
const signSuccess = (account: string, pwd: string) => {
	username.value = account;
	password.value = pwd;
};
const onSubmit = async () => {
	if (allowSubmit.value) {
		const result = await accountLoginRequest({ name: username.value, password: password.value });
		if (result.code !== 0) {
			showToast({
				message: `${result.message}`,
				duration: 2000,
				closeOnClick: true,
				position: "top"
			});
			return;
		} else {
			localStorage.setItem("token", result.token);
			localStorage.setItem("id", result.id);
			await router.push("/home");
		}
	} else return;
};
onDeactivated(() => {
	username.value = "";
	password.value = "";
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.login_cpm {
	display: flex;
	justify-content: end;
	color: black;
	padding: 16px;
}

.management {
	position: absolute;
	right: 0;
	opacity: 0;
	visibility: hidden;
	transition: right $transition, opacity $transition, visibility $transition;
	z-index: 10;
	height: 100vh;
}

.showManagement {
	right: 100vw;
	opacity: 1;
	visibility: visible;
}

:deep(.van-icon-clear) {
	position: absolute;
	right: -5px;
}
</style>
