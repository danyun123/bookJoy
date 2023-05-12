import hyRequest from "..";

export function accountLoginRequest(account: any) {
	return hyRequest.post({
		url: "/login",
		data: account
	});
}
export function accountCreate(account: any) {
	return hyRequest.post({
		url: "/users",
		data: account
	});
}
export function passwordmodify(account: any) {
	return hyRequest.patch({
		url: "/users",
		data: account
	});
}
