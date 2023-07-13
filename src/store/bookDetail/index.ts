import { defineStore } from "pinia";
import { getBookDetail } from "@/service/bookDetail";

const useBookDetail = defineStore("bookDetail", {
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
