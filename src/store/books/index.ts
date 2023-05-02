import { defineStore } from "pinia";

const useBooks = defineStore("books", {
	state: () => ({
		currentBookUrl: "",
		showBar: true
	})
});

export default useBooks;
