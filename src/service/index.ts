import { localCache } from "@/utils/cache";
import { BASE_URL, TIME_OUT } from "./config";
import HYRequest from "./request";

const hyRequest = new HYRequest({
	baseURL: BASE_URL,
	timeout: TIME_OUT,
	interceptors: {
		requestSuccessFn: (config) => {
			const token = localCache.getCache("token");
			if (config.headers && token) {
				config.headers.Authorization = token;
			}
			return config;
		}
	}
});

export default hyRequest;
