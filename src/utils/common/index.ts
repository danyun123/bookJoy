import { LOCAL_FONT_FAMILY, LOCAL_FONT_SIZE, LOCAL_THEME_COLOR } from "@/assets/constant";

export const getBooksConfig = () => {
	const local_font_size = localStorage.getItem(LOCAL_FONT_SIZE);
	const local_font_family = localStorage.getItem(LOCAL_FONT_FAMILY);
	const local_theme_color = localStorage.getItem(LOCAL_THEME_COLOR);
	return {
		local_font_size,
		local_font_family,
		local_theme_color
	};
};

export const strToNum = (str: string) => {
	const arr = str.match(/\d+/g) as string[];
	return +arr[0];
};
