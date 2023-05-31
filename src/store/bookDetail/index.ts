import { defineStore } from "pinia";
import { getBookDetail } from "@/service/listenBook";

const useBookDetail = defineStore("listenBook", {
	state: () => ({
		bookData: null as any
	}),
	actions: {
		fetchBookData(fileName: string) {
			getBookDetail(fileName).then((res) => {
				this.bookData = res.data.data;
			});
		}
	}
});

export default useBookDetail;
