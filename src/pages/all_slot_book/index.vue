<template>
	<div class="all_sort">
		<div class="title">
			<div class="return" @click="returnClick"><van-icon name="arrow-left" />返回</div>
			<span v-if="chineseName">{{ chineseName }}</span>
			<span v-else>共有{{ booksNum }}本书</span>
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
</template>

<script setup lang="ts">
import useHome from "@/store/home";
import { storeToRefs } from "pinia/dist/pinia";
import { useRoute } from "vue-router/dist/vue-router";
import { onActivated, onBeforeMount, onDeactivated, onMounted, ref, watch } from "vue";
import { categoryText, strFistWordToUp } from "@/utils/common";
import { useRouter } from "vue-router";
import throttle from "@/utils/throttle";
import { ALLSORTSCROLLTOP } from "@/assets/constant";

const homeStore = useHome();
const { bookList } = storeToRefs(homeStore);
const { fetchBookList } = homeStore;

const route = useRoute();
const router = useRouter();
let chineseName = ref<string | null>();
const dataList = ref<any>();
const listRef = ref<HTMLElement>();
const booksNum = ref(0);

const allSortScroll = throttle((e: Event) => {
	//@ts-ignore
	localStorage.setItem(ALLSORTSCROLLTOP, e.target.scrollTop);
}, 444);

const returnClick = () => {
	router.back();
};
const itemClick = (book: any) => {
	router.push({
		path: `/bookDetail/${book.fileName}`,
		query: book
	});
};
const getDataByRoute = () => {
	if (Object.keys(bookList.value).length > 0) {
		if (route.params.name === "allBook") {
			dataList.value = bookList.value;
			booksNum.value = (bookList.value as any).total;
			return;
		}
		if (route.query.searchValue) {
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
			return;
		}
		if (route.params) {
			chineseName.value = categoryText(+route.params.name)![1];
			dataList.value = (bookList.value as any).data[strFistWordToUp((route.query.sort_name as string) ?? "")];
		}
	}
};
watch([bookList], (newValue, oldValue) => {
	if ((newValue[0] as any).total === (oldValue[0] as any).total) return;
	getDataByRoute();
});

onActivated(() => {
	if (listRef.value) {
		setTimeout(() => {
			listRef.value!.scrollTop = parseInt(JSON.parse(localStorage.getItem(ALLSORTSCROLLTOP) ?? "0"));
		}, 0);
	}
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
});
onBeforeMount(() => {
	fetchBookList();
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
	.list {
		margin-top: 2.814rem;
		overflow: scroll;
		height: calc(100vh - 2.814rem);
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
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
}
</style>
