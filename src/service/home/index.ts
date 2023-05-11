import axios from "axios";
import "@/mock/index.js";

export function getHomeData() {
	return axios.get(`${import.meta.env.VITE_SERVICE_URL}/book/home`);
}
