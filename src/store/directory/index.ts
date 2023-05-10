import { defineStore } from "pinia";

type displayCpmType = "Directory_bookmark" | "Directory_content" | "Directory_search" | "Directory_detailed";

const useDirectory = defineStore("directory", {
	state: () => ({
		displayCpm: "Directory_content" as displayCpmType,
		searchValue: "",
		confirmSearch: false
	})
});

export default useDirectory;
