import { defineStore } from "pinia";
import type { Book } from "epubjs";

export type currentMenuType = "" | "fontSize" | "themeColor" | "fontFamily" | "directory" | "progress";
export type themeColorType = "default" | "fresh" | "eye_protection" | "wood";
export interface currentBookMetaDataType {
	creator: string;
	description: string;
	direction: null | string;
	flow: string;
	identifier: string;
	language: string;
	layout: string;
	media_active_class: string;
	modified_date: string;
	orientation: string;
	pubdate: string;
	publisher: string;
	rights: string;
	spread: string;
	title: string;
	viewport: string;
}
const useBooks = defineStore("books", {
	state: () => ({
		bookPrototype: {} as Book,
		directoryLoadOver: false,
		fontSize: 0,
		fontFamily: "",
		currentBookMetaData: {} as currentBookMetaDataType,
		currentSection: 0 as number | { isInitialize: boolean; section: number },
		maxSectionLength: 0,
		totalPageLength: 0,
		entireReadTime: 0,
		directorySelected: "",
		presentReadTime: 0,
		currentLocationPercentage: 0,
		entireDirectory: [] as any[],
		currentBookCover: "",
		themeColor: "" as themeColorType,
		showBar: true,
		currentMenu: "" as currentMenuType,
		showDialog: false
	})
});

export default useBooks;
