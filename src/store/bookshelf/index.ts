import { defineStore } from "pinia";

export interface groupDataListType {
	type: string;
	name: string;
	fileName: string;
	bookList: any[];
}

const useBookshelf = defineStore("bookshelf", {
	state: () => ({
		currentPage: "bookshelf" as "bookshelf" | "download" | "groupDetail",
		downloadOverBooks: [] as any[],
		groupItemHeight: 60,
		downloadPageSelectedList: [] as any[],
		groupDetailSelectedList: [] as any[],
		showGroupDetail: false as boolean,
		groupDetailData: {} as groupDataListType | [],
		isEditing: false as boolean
	})
});

export default useBookshelf;
