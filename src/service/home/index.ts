import axios from "axios";

export function getHomeData() {
	return axios.get(`${import.meta.env.VITE_BOOKS_BASE_URL}/book/home`);
}

export function getBookList() {
	return axios.get(`${import.meta.env.VITE_BOOKS_BASE_URL}/book/list`);
}
