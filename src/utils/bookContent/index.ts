//@ts-nocheck

import type { Book } from "epubjs";
import { strToNum } from "@/utils/common";
import pLimit from "p-limit";

export const getBookUrl = (url: String): string => {
	const baseURL = `${import.meta.env.VITE_BASE_URL}/`;
	return `${baseURL}${url}`;
};

export const getCurrentSectionInfo = (book: Book) => {
	const currentLocation = book.rendition.currentLocation();
	//@ts-ignore
	return book.spine.get(currentLocation.start.index);
};

export const getCurrentLocation = (book: Book, pageLength: number = 7000) => {
	if (pageLength === 0) pageLength = 7000;
	// 获取当前位置（CFI）
	const currentLocationCFI = book.rendition.currentLocation().end?.cfi;
	// 使用当前位置 CFI 获取当前页数
	const currentPage = book.locations.locationFromCfi(currentLocationCFI);
	// 计算当前位置百分比
	const percentage = Math.floor((currentPage / pageLength) * 100);
	// 获取当前章节
	const section = book.spine.get(currentLocationCFI).index;
	localStorage.setItem(book.cover, JSON.stringify({ currentLocationCFI, percentage, pageLength, section }));
	return {
		percentage,
		section
	};
};

export interface bookmarkType {
	cfi: string;
	text: {
		date: string;
		name: string;
	};
}

// export const getCurrentCFIText = (book: Book, section: number) => {
// 	const currentCFI: string = getCurrentPageCFI(book);
// 	const currentBookmark: bookmarkType[] = [{ cfi: currentCFI, text: "" }];
// 	console.log(book.spine.get(section));
// 	// const cfibase = currentCFI.replace(/!.*/, "");
// 	// const cfistart = currentCFI.replace(/.*!/, "").replace(/\)$/, "");
// 	// const cfiend = book.rendition.currentLocation().end.cfi.replace(/.*!/, "").replace(/\)$/, "");
// 	// const cfirange = `${cfibase}!,${cfistart},${cfiend})`;
// 	return currentBookmark;
// };

export const getCurrentPageCFI = (book: Book) => {
	return book.rendition.currentLocation()?.end.cfi;
};

export const flatNavArr = (navArr: any[]) => {
	const newNav = [];
	const fun = (arr) => {
		arr.forEach((item) => {
			const { subitems, ...withoutSubItems } = item;
			newNav.push(withoutSubItems);
			if (item.subitems.length === 0) return;
			fun(item.subitems);
		});
	};
	fun(navArr);
	return newNav;
};

export const formatFlatNavArr = (navArr: any[]) => {
	const map = {};
	const result = [];
	for (const obj of navArr) {
		map[obj.id] = { ...obj, subitems: [] };
	}
	for (const obj of navArr) {
		const parent = map[obj.parent];
		if (parent) {
			parent.subitems.push(map[obj.id]);
		} else {
			result.push(map[obj.id]);
		}
	}
	return result;
};

export const isChildSelected = (id: number, subitems: any[]): boolean => {
	const stack = [...subitems];
	while (stack.length) {
		const item = stack.pop();
		if (strToNum(item.id) - 1 === id) {
			return true;
		}
		if (item.subitems) {
			stack.push(...item.subitems);
		}
	}
	return false;
};

// export function doSearch(book: Book, q: string | number) {
// 	return Promise.all(
// 		book.spine.spineItems.map((item) =>
// 			item.load(book.load.bind(book)).then(item.find.bind(item, q)).finally(item.unload.bind(item))
// 		)
// 	).then((results) => {
// 		console.log(results.flat());
// 		return results.flat();
// 	});
// }

const limit = pLimit(5);

export function doSearch(book: Book, q: string | number) {
	return Promise.all(
		book.spine.spineItems.map((item) =>
			limit(() => item.load(book.load.bind(book)).then(item.find.bind(item, q)).finally(item.unload.bind(item)))
		)
	).then((results) => {
		return results.flat();
	});
}
