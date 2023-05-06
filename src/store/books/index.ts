import { defineStore } from "pinia";

export type currentMenuType = "" | "fontSize" | "themeColor" | "fontFamily" | "moreMenu" | "progress";

const useBooks = defineStore("books", {
	state: () => ({
		directoryLoadOver: false,
		fontSize: 0,
		fontFamily: "",
		currentBook: "",
		currentSection: 0 as number | { isInitialize: boolean; section: number },
		maxSectionLength: 0,
		totalPageLength: 0,
		currentSectionTitle: "",
		currentLocationPercentage: 0,
		showBar: true,
		currentMenu: "" as currentMenuType,
		showDialog: false
	})
});

export default useBooks;
