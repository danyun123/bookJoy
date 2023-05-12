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

export const categoryText = (category: number) => {
	switch (category) {
		case 1:
			return ["computerScience", "计算机科学"];
		case 2:
			return ["socialSciences", "社会科学"];
		case 3:
			return ["economics", "经济学"];
		case 4:
			return ["education", "教育学"];
		case 5:
			return ["engineering", "工程学"];
		case 6:
			return ["environment", "环境学"];
		case 7:
			return ["geography", "地理学"];
		case 8:
			return ["history", "历史学"];
		case 9:
			return ["laws", "法律学"];
		case 10:
			return ["lifeSciences", "生命科学"];
		case 11:
			return ["literature", "文学"];
		case 12:
			return ["biomedicine", "生物医学"];
		case 13:
			return ["businessandManagement", "管理学"];
		case 14:
			return ["earthSciences", "地球学"];
		case 15:
			return ["materialsScience", "材料学"];
		case 16:
			return ["mathematics", "数学"];
		case 17:
			return ["medicineAndPublicHealth", "生活健康学"];
		case 18:
			return ["philosophy", "哲学"];
		case 19:
			return ["physics", "物理学"];
		case 20:
			return ["politicalScienceAndInternationalRelations", "社会关系学"];
		case 21:
			return ["psychology", "心理学"];
		case 22:
			return ["statistics", "统计数据学"];
	}
};

export const strFistWordToUp = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
