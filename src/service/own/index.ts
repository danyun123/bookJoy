import axios from "axios";

export function editUserImg(arg: FormData, id: number) {
	const token = localStorage.getItem("token");
	return axios.post(`http://124.71.33.153:8888/editUserImg`, arg, {
		headers: {
			Authorization: token,
			"Content-Type": "multipart/form-data"
		},
		params: { id }
	});
}

export function getUserInfo(id: number) {
	const token = localStorage.getItem("token");
	return axios.get(`http://124.71.33.153:8888/findUser`, {
		params: {
			id: String(id)
		},
		headers: {
			Authorization: token
		}
	});
}
