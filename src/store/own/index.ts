import { defineStore } from "pinia";
import { editUserImg, getUserInfo } from "@/service/own";

const useOwnStore = defineStore("index", {
	state: () => ({
		imgUrl: "",
		name: "",
		id: 0
	}),
	actions: {
		async fetchEditUserImg(arg: FormData) {
			const result = await editUserImg(arg, this.id);
			this.imgUrl = `http://124.71.33.153:8888/${result.data.url}`;
			return result;
		},
		async fetchGetUserInfo(id: number) {
			const data = await getUserInfo(id);
			this.name = data.data.result[0].name;
			this.id = data.data.result[0].id;
			const imgUrl = data.data.result[0].userImg;
			if (imgUrl.startsWith("http")) {
				this.imgUrl = imgUrl;
			} else {
				this.imgUrl = `http://124.71.33.153:8888/${imgUrl}`;
			}
		}
	}
});
export default useOwnStore;
