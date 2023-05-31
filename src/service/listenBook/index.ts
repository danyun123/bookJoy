import axios from "axios";

export const getBookDetail = (fileName: string) => {
	return axios.get(`${import.meta.env.VITE_BOOK_DETAIL_URL}/book/detail`, {
		params: { fileName }
	});
};
