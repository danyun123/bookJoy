export const flatSelectBooks = (bookList: any[]): any[] => {
	const flatBooks: any[] = [];
	bookList.forEach((book: any) => {
		if (book.type === "group") {
			book.bookList.forEach((item: any) => {
				flatBooks.push(item);
			});
		} else {
			flatBooks.push(book);
		}
	});
	return flatBooks;
};
