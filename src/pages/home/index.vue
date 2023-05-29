<template>
	<div
		class="home"
		:style="{
			overflow: !insideSearch ? 'scroll' : 'hidden'
		}"
		ref="homeRef"
		@scroll.passive="(e) => homeScroll(e)"
	>
		<Home_random :class="{ rcmdCard: true, showCard: showRecommendCard }" :data="homeData.random ?? []" />
		<Home_head />
		<Home_banner :banner="homeData.banner" />
		<Home_guessLike :data="homeData.guessYouLike" />
		<Home_recommend :data="homeData.recommend" />
		<Home_featured :data="homeData.featured" />
		<template v-for="(item, index) in homeData.categoryList" :key="index">
			<Home_classification :data="item.list" :text="item.categoryText" />
		</template>
		<Home_slot :data="homeData.categories" />
	</div>
</template>

<script setup lang="ts">
import Home_head from "./components/home_head/index.vue";
import Home_banner from "./components/home_banner/index.vue";
import Home_guessLike from "./components/home_guessLike/index.vue";
import Home_recommend from "./components/home_recommend/index.vue";
import Home_featured from "./components/home_featured/index.vue";
import Home_slot from "./components/home_sort/index.vue";
import Home_classification from "@/components/home_classification/index.vue";
import Home_random from "./components/home_random/index.vue";
import useHome from "@/store/home";
import { onActivated, onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia/dist/pinia";
import { useRoute } from "vue-router/dist/vue-router";
import throttle from "@/utils/throttle";
import { HOMESCROLLTOP } from "@/assets/constant";

const homeStore = useHome();
const { fetchHomeData } = homeStore;
const { homeData, insideSearch, homeScrollTop, showRecommendCard } = storeToRefs(homeStore);
const route = useRoute();
const homeRef = ref<HTMLDivElement>();
let throttleTime = ref(0);

const homeScroll = throttle((e: Event) => {
	//@ts-ignore
	const scrollTop = e.target.scrollTop;
	localStorage.setItem(HOMESCROLLTOP, scrollTop);
	if (scrollTop < window.innerHeight / 4) {
		homeScrollTop.value = scrollTop;
		throttleTime.value = 0;
		return;
	}
	throttleTime.value = 666;
}, throttleTime.value);
const setHomeScrollTop = () => {
	homeRef.value!.scrollTop = parseInt(localStorage.getItem(HOMESCROLLTOP) ?? "0") ?? 0;
};
onActivated(() => {
	if (homeRef.value) setHomeScrollTop();
});
onMounted(() => {
	localStorage.setItem(HOMESCROLLTOP, "0");
});
onBeforeMount(() => {
	fetchHomeData();
});
watch([route], () => {
	insideSearch.value = false;
});
watch([homeScrollTop], () => {
	if (homeScrollTop.value === 0) {
		homeRef.value!.scrollTop = 0;
	}
});
onUnmounted(() => {
	localStorage.setItem(HOMESCROLLTOP, "0");
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.home {
	width: 100%;
	height: 100vh;
	background-color: #f4f4f4;
	overflow: scroll;
	.rcmdCard {
		visibility: hidden;
		:deep(.recommend_card_content) {
			transition: opacity $transition, transform $transition;
			opacity: 0;
			transform: scale(0);
			transform-origin: center;
		}
	}
	.showCard {
		visibility: visible;
		:deep(.recommend_card_content) {
			opacity: 1;
			transform: scale(1);
		}
	}
}
</style>
