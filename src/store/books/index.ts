import { defineStore } from "pinia";

export type currentMenuType = "" | "fontSize" | "light" | "fontFamily" | "moreMenu";

const useBooks = defineStore("books", {
	state: () => ({
		fontSize: 12,
		fontFamily: "default",
		currentBook: "",
		showBar: true,
		currentMenu: "" as currentMenuType,
		showDialog: false
	})
});

export default useBooks;
