import Mock from "mockjs";
import BookHomeApi from "./bookHome";
import BookShelfApi from "./bookShelf";
import BookHomeList from "./bookList";
import BookFlatList from "./bookFlatList";
import BookCategoryList from "./bookCategoryList";

Mock.setup({
	timeout: "350-600"
});

Mock.mock(/\/book\/home/, "get", BookHomeApi);
Mock.mock(/\/book\/shelf/, "get", BookShelfApi);
Mock.mock(/\/book\/list/, "get", BookHomeList);
Mock.mock(/\/book\/flat-list/, "get", BookFlatList);
Mock.mock(/\/book\/category/, "get", BookCategoryList);

export default Mock;
