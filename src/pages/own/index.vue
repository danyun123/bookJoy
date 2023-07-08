<template>
	<div class="own">
		<div class="title">
			<img :src="pictureUrl" alt="图片显示错误" />
			<van-uploader :before-read="beforeRead" class="upload" max-size="10,485,760" max-count="1" reupload>
				<div>修改图片</div>
			</van-uploader>
			<div class="name">{{ name }}</div>
		</div>
		<div class="userinfo"></div>
		<div class="moreInfo">
			<!--			<div class="item">-->
			<!--				<span><van-icon name="gold-coin-o" /> 钱包</span>-->
			<!--				<span><van-icon name="arrow" /></span>-->
			<!--			</div>-->
			<!--			<div class="item">-->
			<!--				<span><van-icon name="setting-o" /> 设置</span>-->
			<!--				<span><van-icon name="arrow" /></span>-->
			<!--			</div>-->
			<div class="item" @click="feedbackClick">
				<span><van-icon name="comment-circle-o" color="#9b62f5" /> 反馈</span>
				<span><van-icon name="arrow" /></span>
			</div>
			<!--			<div class="item">-->
			<!--				<span><van-icon name="comment-o" /> 相关信息</span>-->
			<!--				<span><van-icon name="arrow" /></span>-->
			<!--			</div>-->
		</div>
		<div class="touLogin" @click="outLogin">退出登录</div>
	</div>
</template>

<script setup lang="ts">
import { onActivated, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import useOwnStore from "@/store/own";
import { storeToRefs } from "pinia/dist/pinia";
import { showToast } from "vant";

const ownStore = useOwnStore();
const { name, imgUrl } = storeToRefs(ownStore);
const pictureUrl = ref<string>("");
const router = useRouter();
const outLogin = () => {
	router.push("/login");
	localStorage.removeItem("token");
};

const feedbackClick = () => {
	window.open("https://github.com/danyun123/bookJoy/issues");
};
const beforeRead = async (file: File) => {
	if (!file.type.startsWith("image/")) {
		showToast({
			message: `请选择正确的图片格式`,
			duration: 2000,
			closeOnClick: true,
			position: "top"
		});
		return;
	}
	showToast({
		message: `正在上传中~`,
		duration: 1500,
		closeOnClick: true,
		position: "top"
	});
	const formData = new FormData();
	formData.set("img", file);
	const result = await ownStore.fetchEditUserImg(formData);
	showToast({
		message: `上传完毕`,
		duration: 0,
		closeOnClick: true,
		position: "top"
	});
};
watchEffect(() => {
	pictureUrl.value = imgUrl.value;
});
onActivated(() => {
	const id = localStorage.getItem("id");
	ownStore.fetchGetUserInfo(Number(id));
});
</script>

<style scoped lang="scss">
.own {
	.title {
		display: inline-block;
		position: relative;
		text-align: center;
		margin-top: 20px;
		left: 50%;
		transform: translateX(-50%);

		img {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			object-fit: cover;
		}

		.name {
			font-size: 20px;
		}

		.upload {
			position: absolute;
			right: -100%;
			top: 50%;
			font-size: 0.95rem;
			color: #8090fc;
		}
	}

	.userinfo {
		margin-top: 20px;
		text-align: center;
	}

	.touLogin {
		position: absolute;
		width: 80%;
		left: 50%;
		bottom: 15%;
		transform: translateX(-50%);
		padding: 10px 0;
		text-align: center;
		background-color: #a8c0ff;
		border-radius: 15px;
	}

	.moreInfo {
		padding: 0 2.143rem;
		margin-top: 5.714rem;
		font-size: 1.2rem;

		.item {
			margin: 2.5rem 0;
			display: flex;
			justify-content: space-between;
			padding-bottom: 0.571rem;
			border-bottom: 1px solid #dedede;
		}
	}
}
</style>
