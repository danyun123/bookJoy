import hyRequest from "..";

interface accountType {
	name: string;
	password: string;
}

export function accountLoginRequest(account: accountType) {
	return hyRequest.post({
		url: "/login",
		data: account
	});
}

export function accountRegisterRequest(account: accountType) {
	return hyRequest.post({
		url: "/register",
		data: account
	});
}

// export function passwordmodify(account: any) {
// 	return hyRequest.patch({
// 		url: "/users",
// 		data: account
// 	});
// }
