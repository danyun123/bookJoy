import { defineStore } from "pinia";

export type themeColorType = "default" | "fresh" | "eye_protection" | "wood";

const useGlobal = defineStore("global", {
	state: () => ({
		themeColor: "" as themeColorType
	})
});

export default useGlobal;
