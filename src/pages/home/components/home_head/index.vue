<template>
	<div class="head">
		<div :class="{ nav: true, isHeadHide: hideHead }" v-if="route.path === '/home'">
			<div class="title">书城</div>
			<div class="random" @click="randomRcmdClick">
				<van-icon name="guide-o" />
			</div>
		</div>
		<div class="search" :style="{ top: searchScrollTop, transition: transitionStyle }" ref="searchRef">
			<div class="search_return" v-if="route.path === '/home/search'" @click="handelReturnClick">
				<van-icon name="arrow-left" />
				返回
			</div>
			<van-search
				v-model="searchValue"
				placeholder="请输入搜索关键词"
				@focus="handelSearchFocus"
				@keydown.stop.exact.enter="confirmSearch"
				:style="{ scale: scaleNum, transition: 'scale 100ms linear,width 100ms linear' }"
			/>
			<div class="confirm" v-if="route.path === '/home/search'" @click="confirmSearch">确认</div>
		</div>
		<router-view @searchPageInto="searchPageInto" />
	</div>
	<template v-if="showRandom">
		<Home_Random />
	</template>
</template>

<script setup lang="ts">
import useHome from "@/store/home";
import { storeToRefs } from "pinia/dist/pinia";
import { useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useRoute } from "vue-router/dist/vue-router";
import { SEARCH_HISTORY } from "@/assets/constant";
import Home_Random from "../home_random/index.vue";

const searchValue = ref();
const homeStore = useHome();
const { hideHead, search_history, homeScrollTop, showRecommendCard, homeData, RecommendCardBookIndex } =
	storeToRefs(homeStore);
const router = useRouter();
const route = useRoute();
const scaleNum = ref(1);
const searchRef = ref<Element>();
const HTMLFontSize = ref(parseFloat(getComputedStyle(document.documentElement).fontSize));
const showRandom = ref(false);
const transitionStyle = ref<null | string>(null);
const initSearchTop = "3.1";
const searchScrollTop = ref<string>(initSearchTop + "rem");

const handelSearchFocus = () => {
	if (route.path === "/home/search") return;
	homeScrollTop.value = 0;
	hideHead.value = true;
	router.push("/home/search");
};
const handelReturnClick = () => {
	searchValue.value = "";
	hideHead.value = false;
	router.push("/home");
};
const searchPageInto = () => {
	searchScrollTop.value = "0";
};
const confirmSearch = () => {
	if (searchValue.value.trim() === "") return;
	router.push({
		path: `/sortBook/home_search`,
		query: {
			searchValue: searchValue.value
		}
	});
	const data = JSON.parse(localStorage.getItem(SEARCH_HISTORY) ?? "[]");
	search_history.value = [...data, searchValue.value];
	localStorage.setItem(SEARCH_HISTORY, JSON.stringify([...data, searchValue.value]));
	searchValue.value = "";
};
window.addEventListener("resize", () => {
	HTMLFontSize.value = parseFloat(getComputedStyle(document.documentElement).fontSize);
});
watch([homeScrollTop], () => {
	let top = Number(initSearchTop) * HTMLFontSize.value - Math.floor(homeScrollTop.value);
	if (top < 0) {
		transitionStyle.value = "top 100ms linear";
		top = 0;
	} else {
		transitionStyle.value = null;
	}
	scaleNum.value =
		top / (Number(initSearchTop) * HTMLFontSize.value) < 0.9 ? 0.9 : top / (Number(initSearchTop) * HTMLFontSize.value);
	searchScrollTop.value = top + "px";
});
watch([route], () => {
	transitionStyle.value = "top 100ms linear";
	if (route.path === "/home/search") {
		searchScrollTop.value = "0";
	} else {
		searchScrollTop.value = initSearchTop + "rem";
	}
});
const randomRcmdClick = () => {
	if (homeData) {
		//@ts-ignore
		RecommendCardBookIndex.value = Math.floor(Math.random() * homeData.value.random.length);
	}
	showRecommendCard.value = true;
};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";

.head {
	background: linear-gradient(to right, #efbec3, #e7e7e7);

	padding: $pagePadding $pagePadding 0.529rem $pagePadding;

	.nav {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		visibility: visible;
		opacity: 1;
		position: relative;

		.return {
			margin-left: 0.714rem;
		}

		.title {
			font-size: 1.25rem;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
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
		width: auto;
		position: fixed;
		left: 0;
		right: 0;
		z-index: 2;
		padding: 0 $pagePadding;
		min-width: $minWidth;

		.search_return,
		.confirm {
			line-height: 54px;
		}

		.search_return {
			margin-left: -0.357rem;
		}

		.van-search {
			background: none;
			padding: 10px 5px;
			flex: 1;

			:deep(.van-search__content) {
				padding: 0;
				background-color: #e2e2e2;
				border-radius: 1.071rem;
				overflow: hidden;
			}

			:deep(.van-field__control) {
				background-color: #e2e2e2;
			}

			:deep(.van-search__field) {
				background-color: #e2e2e2;
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
