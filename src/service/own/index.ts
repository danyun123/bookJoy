import hyRequest from "@/service";

export function accountImage(arg: any) {
	return hyRequest.post({
		url: "/file/avatar",
		data: arg,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
}
