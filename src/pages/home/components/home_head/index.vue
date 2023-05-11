<template>
	<div class="head">
		<div :class="{ nav: true, isHeadHide: hideHead }" v-if="route.path === '/home'">
			<div class="return">
				<van-icon name="arrow-left" />
			</div>
			<div class="title">书城</div>
			<div class="random" @click="randomClick"><van-icon name="guide-o" /></div>
		</div>
		<div class="search">
			<div class="search_return" v-if="route.path === '/home/search'" @click="handelReturnClick">
				<van-icon name="arrow-left" />
				返回
			</div>
			<van-search
				v-model="searchValue"
				placeholder="请输入搜索关键词"
				@focus="handelSearchFocus"
				@keydown.stop.exact.enter="confirmSearch"
			/>
			<div class="confirm" v-if="route.path === '/home/search'" @click="confirmSearch">确认</div>
		</div>
		<router-view />
	</div>
	<template v-if="showRandom">
		<Home_Random />
	</template>
</template>

<script setup lang="ts">
import useHome from "@/store/home";
import { storeToRefs } from "pinia/dist/pinia";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useRoute } from "vue-router/dist/vue-router";
import { SEARCH_HISTORY } from "@/assets/constant";
import Home_Random from "../home_random/index.vue";

const searchValue = ref();
const homeStore = useHome();
const { hideHead, search_history } = storeToRefs(homeStore);
const router = useRouter();
const route = useRoute();
const showRandom = ref(false);
const handelSearchFocus = () => {
	if (route.path === "/home/search") return;
	hideHead.value = true;
	router.push("/home/search");
};
const handelReturnClick = () => {
	hideHead.value = false;
	router.push("/home");
};
const confirmSearch = () => {
	const data = JSON.parse(localStorage.getItem(SEARCH_HISTORY) ?? "[]");
	search_history.value = [...data, searchValue.value];
	localStorage.setItem(SEARCH_HISTORY, JSON.stringify([...data, searchValue.value]));
	searchValue.value = "";
};
const randomClick = () => {
	console.log("推荐书籍");
};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";
.head {
	padding: $pagePadding $pagePadding 0 $pagePadding;
	font-size: 1.1rem;
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		visibility: visible;
		opacity: 1;
		.return {
			margin-left: 0.714rem;
		}
		.title {
			font-size: 1.25rem;
		}
		.random {
			margin-right: 0.714rem;
			:deep(.van-icon) {
				font-size: 1.4rem !important;
			}
		}
	}
	.isHeadHide {
		opacity: 0;
		visibility: hidden;
	}
	.search {
		display: flex;
		justify-content: space-between;
		.search_return,
		.confirm {
			line-height: 54px;
		}
		.search_return {
			margin-left: -0.357rem;
		}
		.van-search {
			background-color: transparent;
			flex: 1;
			:deep(.van-search__content) {
				padding: 0;
			}
			:deep(.van-search__field) {
				background-color: #e2e2e2;
				border-radius: 1.071rem;
				color: black;
				padding-left: 0.714rem;
				input {
					&::placeholder {
						color: #8f8d8d !important;
						font-size: 0.8rem;
					}
				}
				.van-badge__wrapper {
					font-size: 1.5rem;
				}
			}
		}
	}
}
</style>
