//@ts-nocheck

import type { Book } from "epubjs";

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
	const currentLocation = book.rendition.currentLocation().start.cfi;
	// 使用当前位置 CFI 获取当前页数
	const currentPage = book.locations.locationFromCfi(currentLocation);
	// 计算当前位置百分比
	const percentage = Math.floor((currentPage / pageLength) * 100);
	localStorage.setItem(book.cover, JSON.stringify({ currentLocation, percentage, pageLength, section }));
	return percentage;
};
