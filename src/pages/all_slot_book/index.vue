<template>
	<div class="all_sort">
		<div class="title">
			<div class="return" @click="returnClick">
				<van-icon name="arrow-left" />
				返回
			</div>
			<span v-if="chineseName">{{ chineseName }}</span>
			<span v-else-if="booksNum >= 0">共有{{ booksNum }}本书</span>
		</div>
		<div class="content">
			<div class="menu_container">
				<template v-for="item in menuList" :key="item">
					<div
						:class="{
							menu_item: true,
							active_menu_item: currentMenu === item,
							disabled_menu_item: !selectableMenuList.includes(item) && item !== '全部'
						}"
						@click="() => menuItemClick(item)"
					>
						{{ getCHNameByEn(item) }}
					</div>
				</template>
			</div>
			<div class="list" v-if="dataList" @scroll="allSortScroll" ref="listRef">
				<template v-for="(value, key) in dataList.total ? dataList.data : dataList" :key="key">
					<div class="sort_far_name" v-if="!chineseName">{{ categoryText(value[0].category)[1] }}</div>
					<div class="item" v-if="chineseName" @click="() => itemClick(value)">
						<div class="cover">
							<img :src="value.cover" alt="图片加载错误" />
						</div>
						<div class="info">
							<div class="name">{{ value.fileName }}</div>
							<div class="author">{{ value.author }}</div>
							<div class="sort_name">{{ chineseName }}</div>
						</div>
					</div>
					<div class="all_sort_books_list" v-else>
						<template v-for="item in value" :key="item.id">
							<div class="item" @click="() => itemClick(item)">
								<div class="cover">
									<img :src="item.cover" alt="图片加载错误" />
								</div>
								<div class="info">
									<div class="name">{{ item.fileName }}</div>
									<div class="author">{{ item.author }}</div>
									<div class="sort_name">{{ categoryText(value[0].category)[1] }}</div>
								</div>
							</div>
						</template>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useHome from "@/store/home";
import { storeToRefs } from "pinia/dist/pinia";
import { useRoute } from "vue-router/dist/vue-router";
import { onActivated, onDeactivated, onMounted, ref } from "vue";
import { categoryText, getCHNameByEn, strFistWordToUp } from "@/utils/common";
import { useRouter } from "vue-router";
import throttle from "@/utils/throttle";
import { ALLSORTSCROLLTOP } from "@/assets/constant";

const homeStore = useHome();
const { bookList } = storeToRefs(homeStore);
const { fetchBookList } = homeStore;

const route = useRoute();
const router = useRouter();
const chineseName = ref<string | null>();
const dataList = ref<any>();
const listRef = ref<HTMLElement>();
const searchValue = ref<string | null>("");
const booksNum = ref();
const menuList = ref(["唱", "跳", "rap", "篮球"]);
const currentMenu = ref();
const selectableMenuList = ref<string[]>([]);
const filterMenuList = ref();

const allSortScroll = throttle((e: Event) => {
	//@ts-ignore
	localStorage.setItem(ALLSORTSCROLLTOP, e.target.scrollTop);
}, 444);

const returnClick = () => {
	if (route.path.includes("home_search")) {
		router.back();
	} else router.push("/home");
};
const itemClick = (book: any) => {
	router.push({
		path: `/bookDetail/${book.fileName}`
	});
};
const getDataByRoute = () => {
	if (route.params.name === "allBook") {
		dataList.value = (bookList.value as any).data;
		booksNum.value = (bookList.value as any).total;
		chineseName.value = null;
		currentMenu.value = "全部";
		return;
	}
	if (route.query.searchValue) {
		searchValue.value = route.query.searchValue as string;
		booksNum.value = 0;
		let data = (bookList.value as any).data;
		data = Object.keys(data).reduce((acc: any, key: string) => {
			const filteredBooks = data[key].reduce((books: any[], book: any) => {
				if (book.fileName.includes(route.query.searchValue)) {
					books.push(book);
					booksNum.value++;
				}
				return books;
			}, []);
			if (filteredBooks.length > 0) {
				acc[key] = filteredBooks;
			}
			return acc;
		}, {});
		dataList.value = data;
		filterMenuList.value = data;
		selectableMenuList.value = Object.keys(data);
		chineseName.value = null;
		currentMenu.value = "全部";
		return;
	}
	if (route.params) {
		if (+route.params.name >= 0) {
			chineseName.value = categoryText(+route.params.name)![1];
		} else {
			chineseName.value = getCHNameByEn(route.params.name as string);
		}
		const menuName = strFistWordToUp((route.query.sort_name as string) ?? "");
		dataList.value = (bookList.value as any).data[menuName];
		currentMenu.value = menuName;
	}
};

const getMenuList = () => {
	menuList.value = Object.keys((bookList.value as any).data);
	menuList.value.unshift("全部");
};

const menuItemClick = async (item: string) => {
	currentMenu.value = item;
	// search页面进入
	if (route.params.name === "home_search") {
		if (item === "全部") {
			await router.push({
				path: `/sortBook/home_search`,
				query: {
					searchValue: searchValue.value
				}
			});
			getDataByRoute();
			return;
		} else {
			currentMenu.value = item;
			dataList.value = Object.fromEntries(Object.entries(filterMenuList.value).filter(([key]) => item === key));
		}
		return;
	}
	// ----
	if (item === "全部") {
		await router.push({
			path: `/sortBook/allBook`
		});
		getDataByRoute();
		return;
	} else {
		await router.push({
			path: `/sortBook/${item}`,
			query: {
				sort_name: `${item}`
			}
		});
		getDataByRoute();
		return;
	}
};
onActivated(async () => {
	if (listRef.value) {
		setTimeout(() => {
			listRef.value!.scrollTop = parseInt(JSON.parse(localStorage.getItem(ALLSORTSCROLLTOP) ?? "0"));
		}, 0);
	}
	await fetchBookList();
	getMenuList();
	getDataByRoute();
});
onMounted(() => {
	localStorage.setItem(ALLSORTSCROLLTOP, "0");
});
onDeactivated(() => {
	if (route.path === "/home") {
		localStorage.setItem(ALLSORTSCROLLTOP, "0");
	}
	dataList.value = [];
	chineseName.value = null;
	currentMenu.value = "";
	searchValue.value = null;
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.all_sort {
	padding: 0 0.714rem;

	.title {
		padding: 0.714rem 0;
		background-color: #f2f2f2;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 2;
		box-shadow: $boxShadow;
		min-width: $minWidth;

		.return {
			display: inline-block;
			margin-left: 0.514rem;
		}

		span {
			position: absolute;
			right: 50%;
			transform: translateX(50%);
			font-size: 1.2rem;
			color: $themeColor;
			font-weight: 600;
		}
	}

	.content {
		overflow-y: auto;
		height: calc(100vh - 0.828rem);
	}

	.list {
		height: auto;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		background-color: white;
		margin-top: 0.714rem;
		border-radius: 0.714rem;
		padding: 0 0.357rem;

		.sort_far_name {
			font-size: 1.35rem;
			width: 100%;
			height: auto;
			color: #6d80ff;
			font-weight: 600;
			margin: 0.714rem 0;
			border-bottom: 1px solid #a9a4a4;
			padding-bottom: 0.571rem;
		}

		.item {
			margin: 1.071rem 0;
			display: flex;
			width: calc(48.8% - 0.857rem);
			box-sizing: border-box;
			flex-shrink: 0;
			max-height: 27.3vh;

			.cover {
				width: 30%;
				flex-grow: 1;
				flex-shrink: 0;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			.info {
				width: 70%;
				flex-grow: 1;
				flex-shrink: 0;
				font-size: 1.1rem;
				margin-left: 10px;
				display: flex;
				flex-direction: column;
				position: relative;
				margin-bottom: 1.429rem;

				.name {
					width: 100%;
					margin-bottom: 0.529rem;
					word-wrap: break-word;
					font-size: 1rem;
					@include displayMultiline();
				}

				.author {
					color: $themeGreyColor;
					font-size: 1rem;
					@include displayMultiline();
				}

				.sort_name {
					color: $themeGreyColor;
					font-size: 1rem;
					@include displayMultiline();
					position: absolute;
					bottom: -1.429rem;
					right: 0.214rem;
				}
			}
		}

		.item:nth-of-type(2n -1) {
			margin-right: 1.7141rem;
		}

		.all_sort_books_list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
		}

		.all_sort_books_list:nth-of-type(2n -1) {
			margin-right: 10px;
		}
	}

	.menu_container {
		margin-top: 3.214rem;
		display: flex;
		flex-wrap: wrap;
		background-color: white;
		border-radius: 0.714rem;

		.menu_item {
			padding: 0.271rem 0.514rem;
			background-color: #eeeeee;
			margin: 6px;
			border-radius: 0.357rem;
			color: #5a5c66;

			&:active {
				@include clickActiveAnimation;
			}
		}

		.active_menu_item {
			background-color: $themeColor;
			color: white;
		}

		.disabled_menu_item {
			@include disabledStyle;
		}
	}
}
</style>
