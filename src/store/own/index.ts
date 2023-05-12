import { defineStore } from "pinia";
import { accountImage } from "@/service/own";

const useOwnStore = defineStore("index", {
	state: () => ({
		imgUrl: ""
	}),
	actions: {
		async fetchAccountImage(arg: any) {
			const imageResult = await accountImage(arg);
			this.imgUrl = imageResult.data;
		}
	}
});
export default useOwnStore;
