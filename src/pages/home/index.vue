<template>
	<div class="home">
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
import useHome from "@/store/home";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia/dist/pinia";

const homeStore = useHome();
const { fetchHomeData } = homeStore;
const { homeData } = storeToRefs(homeStore);
onBeforeMount(() => {
	fetchHomeData();
});
</script>

<style scoped lang="scss">
.home {
	width: 100%;
	height: calc(100vh - 2.428rem);
	background-color: #f4f4f4;
	overflow: scroll;
}
</style>
