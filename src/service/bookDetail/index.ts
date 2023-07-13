import axios from "axios";

export const getBookDetail = (fileName: string) => {
	return axios.get(`${import.meta.env.VITE_BOOKS_BASE_URL}/book/detail`, {
		params: { fileName }
	});
};
