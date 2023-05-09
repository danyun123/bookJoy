//@ts-nocheck

import type { Book } from "epubjs";
import { strToNum } from "@/utils/common";

export const getBookUrl = (url: String): string => {
	const baseURL = "http://localhost";
	return `${baseURL}${url}`;
};

export const getCurrentSectionInfo = (book: Book) => {
	const currentLocation = book.rendition.currentLocation();
	//@ts-ignore
	return book.spine.get(currentLocation.start.index);
};

export const getCurrentLocation = (book: Book, pageLength: number, section?: number) => {
	// 获取当前位置（CFI）
	const currentLocation = book.rendition.currentLocation().start?.cfi;
	// 使用当前位置 CFI 获取当前页数
	const currentPage = book.locations.locationFromCfi(currentLocation);
	// 计算当前位置百分比
	const percentage = Math.floor((currentPage / pageLength) * 100);
	localStorage.setItem(book.cover, JSON.stringify({ currentLocation, percentage, pageLength, section }));
	return percentage;
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
	const stack = [...subitems]; // 使用一个栈来存储待处理的子节点
	while (stack.length) {
		const item = stack.pop(); // 取出栈顶节点
		if (strToNum(item.id) - 1 === id) {
			return true; // 找到目标节点，直接返回true
		}
		if (item.subitems) {
			stack.push(...item.subitems); // 将子节点压入栈中进行后续处理
		}
	}
	return false; // 未找到目标节点，返回false
};
