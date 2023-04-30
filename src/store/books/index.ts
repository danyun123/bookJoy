import { defineStore } from "pinia";

const useBooks = defineStore("books", {
	state: () => ({
		currentBookUrl: ""
	})
})

export default useBooks;