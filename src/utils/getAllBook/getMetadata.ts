import { Book } from "epubjs";

/**
 * 生成所有电子书的metadata信息，并将其合并在一个数组中
 * @param {string[]} bookUrls 电子书文件的URL数组
 * @return {Promise<object[]>} 包含所有电子书metadata信息的Promise对象
 */
async function generateBookMetadata(bookUrls: string[]) {
	const books = bookUrls.map((url) => {
		const book = new Book();
		return book.load(url).then(() => book);
	});

	const loadedBooks = await Promise.all(books);

	return loadedBooks.map((book) => book.loaded.metadata);
}
