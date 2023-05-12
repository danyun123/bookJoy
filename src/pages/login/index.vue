<template>
	<div class="login">
		<div class="content">
			<van-form label-width="70px" show-error>
				<div class="title"><h2>用户登录</h2></div>
				<van-cell-group inset class="group">
					<van-field
						v-model="account.name"
						clearable
						left-icon="user-circle-o"
						label="用户名"
						colon
						required
						placeholder="用户名"
						name="name"
						:rules="[
							{ required: true, message: '请填写用户名' },
							{
								pattern: /^[a-z0-9]{6,18}$/,
								message: '帐号长度6到18位字母或数字组成~'
							}
						]"
					/>

					<van-field
						v-model="account.password"
						type="password"
						name="password"
						class="bottom"
						clearable
						colon
						required
						left-icon="closed-eye"
						label="密码"
						placeholder="密码"
						:rules="[
							{ required: true, message: '请填写密码' },
							{
								pattern: /^[a-z0-9]{3,}$/,
								message: '必须是三位以上的字母或数字组成'
							}
						]"
					/>
				</van-cell-group>
				<div class="box">
					<van-button plain type="primary" @click="handleBtn" hairline size="small">注册</van-button>
					<van-button plain type="primary" @click="handleBtn1" hairline size="small">忘记密码</van-button>
				</div>
				<div style="margin: 16px">
					<van-button round block type="primary" @click="logonHandleClick"> 登录 </van-button>
				</div>
			</van-form>
		</div>
	</div>
	<van-dialog v-model:show="show" title="注册用户" @confirm="registerConfirm" show-cancel-button>
		<van-form>
			<van-cell-group inset>
				<van-field
					v-model="register.name"
					name="name"
					clearable
					label="用户名"
					colon
					placeholder="用户名"
					:rules="[
						{ required: true, message: '请填写用户名' },
						{
							pattern: /^[a-z0-9]{6,18}$/,
							message: '帐号长度6到18位字母或数字组成~'
						}
					]"
				/>
				<van-field
					v-model="register.password"
					type="password"
					name="password"
					clearable
					colon
					label="密码"
					placeholder="密码"
					:rules="[
						{ required: true, message: '请填写密码' },
						{
							pattern: /^[a-z0-9]{3,}$/,
							message: '必须是三位以上的字母或数字组成'
						}
					]"
				/>
				<van-field
					v-model="confirmPsd"
					type="password"
					clearable
					name="confirmPassword"
					colon
					label="确认密码"
					placeholder="密码"
				/>
			</van-cell-group>
		</van-form>
	</van-dialog>
	<van-dialog v-model:show="show1" title="忘记密码" @confirm="forgetConfirm" show-cancel-button>
		<van-form>
			<van-cell-group inset>
				<van-field
					v-model="account.name"
					name="name"
					clearable
					label="用户名"
					colon
					placeholder="用户名"
					:rules="[
						{ required: true, message: '请填写用户名' },
						{
							pattern: /^[a-z0-9]{6,18}$/,
							message: '帐号长度6到18位字母或数字组成~'
						}
					]"
				/>
				<van-field
					v-model="account.password"
					type="password"
					name="password"
					clearable
					colon
					label="密码"
					placeholder="密码"
					:rules="[
						{ required: true, message: '请填写密码' },
						{
							pattern: /^[a-z0-9]{3,}$/,
							message: '必须是三位以上的字母或数字组成'
						}
					]"
				/>
				<van-field
					v-model="confirmPsd"
					type="password"
					name="confirmPassword"
					colon
					clearable
					label="确认密码"
					placeholder="密码"
				/>
			</van-cell-group>
		</van-form>
	</van-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
import useLoginStore from "../../store/login";

const show = ref(false);
const show1 = ref(false);
const confirmPsd = ref("");
const loginStore = useLoginStore();
const account = reactive({
	name: "",
	password: ""
});
const register = reactive({
	name: "",
	password: ""
});
const forget = reactive({
	name: "",
	password: ""
});
function logonHandleClick() {
	const { name, password } = account;
	loginStore.fetchLoginAccount({ name, password });
}
function handleBtn() {
	show.value = true;
}
function handleBtn1() {
	show1.value = true;
}
function registerConfirm() {
	const { name, password } = register;
	if (password === confirmPsd.value) {
		loginStore.fetchCreateAccount({ name, password });
	} else {
		alert("确认密码错误");
	}
}
function forgetConfirm() {
	const { name, password } = forget;
	if (password === confirmPsd.value) {
		loginStore.fetchModifyAccount({ name, password });
	} else {
		alert("确认密码错误");
	}
}
</script>
<style lang="scss" scoped>
.login {
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	background: url("../../assets/img/login-bg.svg");
	.content {
		.group {
			height: 14.286rem;
			padding-top: 3.571rem;
		}
		.box {
			display: flex;
			justify-content: space-between;
			margin-right: 2.143rem;
			margin-left: 2.143rem;
			margin-top: 0.714rem;
		}
	}
}
.van-form {
	padding: 0 1.429rem 0 1.429rem;
	.title {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.van-cell-group {
	border: 1px solid #eadddd;
}
.bottom {
	margin-top: 2.5rem;
}
.van-field {
	align-items: self-start;
	font-size: 1.286rem !important;
	:deep(.van-field__label--required) {
		font-size: 1rem;
	}
	:deep(#van-field-1-label) {
		white-space: nowrap;
	}
	:deep(.van-field__error-message) {
		position: absolute;
		z-index: 20;
	}
	:deep(.van-cell__value) {
		box-sizing: border-box;
		padding-bottom: 10px;
	}
	:deep(.van-icon) {
		margin-top: 0.357rem;
	}
	:deep(.van-field__label) {
		margin-top: 0.357rem;
	}
	:deep(.van-field__control) {
		border: 1px solid #eadddd;
		height: 2.5rem;
	}
	:deep(.van-field__control):hover {
		border: 1px solid rgba(25, 137, 250);
	}
	:deep(.van-icon-clear) {
		position: absolute;
		right: 0.143rem;
	}
}
.van-button {
	font-size: 1.1rem !important;
}
</style>
