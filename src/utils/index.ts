import { BOOK_INFO_SUFFIX } from "@/assets/constant";

export const getBookUrl = <T = string>(url: T): string => {
	const baseURL = "http://localhost";
	return `${baseURL}${url}`;
};

export const setBookInfo = (name: string, key: string, value: string | number) => {
	let info = localStorage.getItem(`${name}${BOOK_INFO_SUFFIX}`);
	if (!info) {
		info = {} as string;
	} else {
		info = JSON.parse(info);
	}
	Object.defineProperty(info, key, { value, enumerable: true });
	localStorage.setItem(`${name}${BOOK_INFO_SUFFIX}`, JSON.stringify(info));
};

export const getBookInfo = (bookName: string) => {
	const { local_fontSize, local_fontFamily } = JSON.parse(localStorage.getItem(bookName + BOOK_INFO_SUFFIX)!);
	return {
		local_fontSize,
		local_fontFamily
	};
};
