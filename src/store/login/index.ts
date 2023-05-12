import { defineStore } from "pinia";
import { localCache } from "@/utils/cache";
import router from "@/router";
import { accountCreate, accountLoginRequest, passwordmodify } from "@/service/login/login";
import { USERNAME } from "@/assets/constant";

interface StateType {
	token: string;
}
const useLoginStore = defineStore("login", {
	state: (): StateType => ({
		token: ""
	}),
	actions: {
		async fetchLoginAccount(values: any) {
			const loginREsult = await accountLoginRequest(values);
			try {
				this.token = loginREsult.data.token;
				localStorage.setItem(USERNAME, loginREsult.data.name);
			} catch (error) {
				alert(loginREsult.message);
			}
			if (loginREsult.code < 0) {
				return;
			}
			localCache.setCache("token", this.token);
			router.push("/home");
		},
		async fetchCreateAccount(account: any) {
			const createReult = await accountCreate(account);
			if (createReult.code) {
				alert(createReult.message);
			} else {
				alert(createReult.message);
			}
		},
		async fetchModifyAccount(account: any) {
			const modeifyRseult = await passwordmodify(account);
			if (modeifyRseult.code === 0) {
				alert(modeifyRseult.message);
			} else {
				alert(modeifyRseult.message);
			}
		}
	}
});
export default useLoginStore;
