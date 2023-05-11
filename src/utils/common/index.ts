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

export const getRandomArr = (arr: any[], length: number) => {
	const indexArr: any[] = [];
	for (let i = 0; i < Infinity; i++) {
		if (indexArr.length === length) {
			return indexArr.map((item) => arr[item]);
		}
		const index = Math.floor(Math.random() * arr.length);
		if (!indexArr.includes(index)) indexArr.push(index);
	}
};

export const realProxyObject = (obj: object | any[]) => {
	return JSON.parse(JSON.stringify(obj));
};

export function categoryText(category: number) {
	switch (category) {
		case 1:
			return "computerScience";
		case 2:
			return "socialSciences";
		case 3:
			return "economics";
		case 4:
			return "education";
		case 5:
			return "engineering";
		case 6:
			return "environment";
		case 7:
			return "geography";
		case 8:
			return "history";
		case 9:
			return "laws";
		case 10:
			return "lifeSciences";
		case 11:
			return "literature";
		case 12:
			return "biomedicine";
		case 13:
			return "businessandManagement";
		case 14:
			return "earthSciences";
		case 15:
			return "materialsScience";
		case 16:
			return "mathematics";
		case 17:
			return "medicineAndPublicHealth";
		case 18:
			return "philosophy";
		case 19:
			return "physics";
		case 20:
			return "politicalScienceAndInternationalRelations";
		case 21:
			return "psychology";
		case 22:
			return "statistics";
	}
}
