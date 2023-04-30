export const getBookUrl = <T = string>(url: T): string => {
	const baseURL = "http://localhost";
	return `${baseURL}${url}`;
};