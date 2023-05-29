import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { setLocalForage } from "@/utils/localForage";

export const download = (
	book: any,
	onSuccess?: (response?: AxiosResponse) => void,
	onError?: (error?: AxiosError) => void,
	onProgress?: (event?: any) => void
) => {
	return axios
		.create({
			baseURL: import.meta.env.VITE_LOCAL_EPUB_URL,
			timeout: 180 * 1000,
			responseType: "blob",
			onDownloadProgress: (progressEvent) => {
				if (onProgress) onProgress(progressEvent);
			}
		})
		.get(`/books/${book.categoryText}/${book.fileName}.epub`)
		.then((res) => {
			const blob = new Blob([res.data], { type: "application/octet-stream" });
			setLocalForage(
				book.fileName,
				blob,
				() => {
					if (onSuccess) onSuccess(res);
				},
				(err) => {
					if (onError) onError(err);
				}
			);
		})
		.catch((err) => {
			if (onError) onError(err);
		});
};
