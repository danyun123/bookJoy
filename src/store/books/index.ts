import { defineStore } from "pinia";

export type currentMenuType = "" | "fontSize" | "themeColor" | "fontFamily" | "moreMenu" | "progress";

const useBooks = defineStore("books", {
	state: () => ({
		directoryLoadOver: false,
		fontSize: 12,
		fontFamily: "default",
		currentBook: "",
		showBar: true,
		currentMenu: "" as currentMenuType,
		showDialog: false
	})
});

export default useBooks;
