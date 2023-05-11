import { defineStore } from "pinia";
import { getHomeData } from "@/service/home";

const useHome = defineStore("home", {
	state: () => ({
		hideHead: false,
		search_history: [] as string[],
		homeData: {}
	}),
	actions: {
		async fetchHomeData() {
			const data = await getHomeData();
			this.homeData = data.data;
		}
	}
});
export default useHome;
