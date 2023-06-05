<template>
	<div class="detail">
		<Head_return />
		<div class="head">
			<div class="cover">
				<img :src="bookData?.cover" alt="图片加载错误" />
			</div>
			<div class="text">
				<div class="name">{{ bookData?.title }}</div>
				<div class="author">{{ bookData?.author }}</div>
				<!--				<div class="description">{{ bookData?.title }}</div>-->
			</div>
			<div class="downloadTip" v-if="isDownload">已下载</div>
		</div>
		<div class="copyright">
			<div class="title_v1">版权</div>
			<div class="publisher clo">
				<div class="title">出版社:</div>
				<div class="title_info">{{ bookData?.publisher }}</div>
			</div>
			<div class="sort clo">
				<div class="title">分类:</div>
				<div class="title_info">
					{{ getCHNameByEn(bookData?.categoryText) }}
				</div>
			</div>
			<div class="lang clo">
				<div class="title">语言:</div>
				<div class="title_info">{{ bookData?.language }}</div>
			</div>
			<div class="ISBN clo">
				<div class="title">ISBN:</div>
				<div class="title_info">{{ bookMetaData?.identifier }}</div>
			</div>
		</div>
		<div class="directory" v-if="loadOver">
			<div class="directory_title">目录</div>
			<template v-for="(item, index) in entireDirectory" :key="item.id">
				<div
					class="directory_item"
					:style="{ paddingLeft: item.level * 1 + 'rem' }"
					@click="() => directoryItemClick(index)"
				>
					{{ index + 1 + ". " + item.label.replace(/[0-9.]/g, "") }}
				</div>
			</template>
		</div>
		<div class="load" v-else>
			<van-loading vertical>
				<template #icon>
					<van-icon name="star-o" size="30" color="#3f7fcb" />
				</template>
				加载中...
			</van-loading>
		</div>
		<div class="btn">
			<div class="readBook btn_item" @click="readClick"><van-icon name="graphic" />立即阅读</div>
			<span class="dividing_line"></span>
			<div class="listenBook btn_item" @click="listenBook"><van-icon name="service-o" />听书</div>
			<span class="dividing_line"></span>
			<div :class="{ addBook: true, isadded: isAdded, btn_item: true }" @click="addBook">
				<span v-if="isAdded">
					<span class="icon">
						<van-icon name="star" />
					</span>
					已在书架中
				</span>
				<span v-else><van-icon name="plus" />加入书架</span>
			</div>
		</div>
	</div>
	<div id="EBook"></div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/dist/vue-router";
import { useRouter } from "vue-router";
import { getCHNameByEn, strFistWordToUp } from "@/utils/common";
import { computed, onActivated, onDeactivated, ref, watchEffect } from "vue";
import { ALLBOOKSHELFNAME, BOOK_DETAIL_CLICK_SECTION, BOOKSHELF, DOWN_LOAD_OVER_BOOKS } from "@/assets/constant";
import useBookDetail from "@/store/bookDetail";
import { storeToRefs } from "pinia/dist/pinia";
import Epub from "epubjs";
import { flatNavArr } from "@/utils/bookContent";
import { getLocalForage } from "@/utils/localForage";
import Head_return from "@/baseUI/head_return/index.vue";

const router = useRouter();
const bookDetailStore = useBookDetail();
const { bookData } = storeToRefs(bookDetailStore);
const route = useRoute();
const bookName = ref();
const isAdded = ref();
const bookMetaData = ref();
const parseOverBook = ref();
const opf = ref();
const downloadOverBook = ref();
const entireDirectory = ref();
const bookNavigation = ref();
const loadOver = ref(false);

const isDownload = computed(() => {
	const fileName = route.path.split("/")[2];
	return downloadOverBook.value?.some((item: any) => item.fileName === fileName);
});
const readClick = () => {
	router.push({
		path: `/books/${strFistWordToUp((bookData.value as any)?.categoryText)}/${(bookData.value as any)?.fileName}.epub`
	});
};
const listenBook = () => {
	getLocalForage(bookName.value, (err, value) => {
		if (value instanceof Blob) {
			router.push({
				path: `/bookListen/${(bookData.value as any)?.fileName}`
			});
		} else {
			router.push({
				path: `/bookListen/${(bookData.value as any)?.fileName}`,
				query: { opf: opf.value }
			});
		}
	});
};
const addBook = () => {
	const books = JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]");
	const names = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
	if (isAdded.value) {
		names.splice(
			names.findIndex((item: string) => item === bookName.value),
			1
		);
		books.forEach((item: any) => {
			let index;
			if (item.type === "group") {
				index = item.bookList.findIndex((book: any) => book.fileName === bookName.value);
				if (index !== -1) item.bookList.splice(index, 1);
			} else {
				index = books.findIndex((item: any) => item.fileName === bookName.value);
				if (index !== -1) books.splice(index, 1);
			}
		});
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify(names));
		localStorage.setItem(BOOKSHELF, JSON.stringify(books));
	} else {
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify([bookName.value, ...names]));
		localStorage.setItem(BOOKSHELF, JSON.stringify([bookData.value, ...books]));
	}
	isAdded.value = !isAdded.value;
};
const directoryItemClick = (section: number) => {
	localStorage.setItem(
		BOOK_DETAIL_CLICK_SECTION,
		JSON.stringify({ href: parseOverBook.value.spine.get(section).href, section })
	);
	readClick();
};
const parseBook = (opf: Blob) => {
	parseOverBook.value = Epub(opf as any);
	parseOverBook.value.loaded.metadata.then((metadata: any) => {
		bookMetaData.value = metadata;
	});
	parseOverBook.value.loaded.navigation.then((nav: any) => {
		loadOver.value = true;
		entireDirectory.value = flatNavArr(nav.toc);
		bookNavigation.value = nav;
	});
};
onActivated(() => {
	const allBookshelfNames = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
	bookName.value = route.path.split("/")[2];
	bookDetailStore.fetchBookData(bookName.value);
	isAdded.value = allBookshelfNames.includes(bookName.value);
	downloadOverBook.value = JSON.parse(localStorage.getItem(DOWN_LOAD_OVER_BOOKS) ?? "[]");
});
watchEffect(() => {
	if (bookData.value) {
		let rootFile = bookData.value.rootFile;
		if (rootFile[0] === "/") {
			rootFile = rootFile.substring(1);
		}
		// 不下载整本电子书，只通过 opf 获取数据
		opf.value = `${import.meta.env.VITE_OPF_BASE_URL}/${bookName.value}/${rootFile}`;
		parseBook(opf.value);
	}
});
onDeactivated(() => {
	loadOver.value = false;
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.detail {
	padding: 0.714rem $pagePadding;
	height: calc(100vh - 5.6rem);
	overflow-y: scroll;
	.return {
		display: inline-block;
		margin-left: -0.414rem;
		font-size: 1.2rem;
		color: $themeColor;
	}
	.head {
		display: flex;
		width: 100%;
		border-bottom: 1px solid #cccaca;
		padding: 0.714rem $pagePadding 30px $pagePadding;
		margin: 0 -#{$pagePadding};
		margin-top: 1.143rem;
		position: relative;
		.cover {
			width: 40%;
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
		.text {
			width: 60%;
			margin-left: 0.714rem;
			.name {
				font-size: 2rem;
				width: 100%;
				word-wrap: break-word;
			}
			.author {
				color: #4b98ff;
				margin: 0.557rem 0;
				font-size: 1.2rem;
			}
			.description {
				margin-top: 20px;
				font-size: 1.2rem;
			}
		}
		.downloadTip {
			position: absolute;
			right: 0;
			bottom: 0.714rem;
			padding: 0.214rem 0 0.214rem 0.429rem;
			background-color: #68c259;
			border-top-left-radius: 0.714rem;
			border-bottom-left-radius: 0.714rem;
			box-shadow: 0 3px 6px 1px #696666;
		}
	}
	.copyright {
		margin-top: 2.857rem;
		border-bottom: 1px solid #cccaca;
		.title_v1 {
			width: 100%;
			font-size: 2rem;
			margin-bottom: 20px;
			font-weight: 600;
		}
		.clo {
			margin: 15px 0;
			display: flex;
			align-items: center;
			color: $themeGreyColor;
			.title {
				font-size: 1.3rem;
				width: 35%;
			}
			.title_info {
				width: 65%;
				font-size: 1.1rem;
			}
		}
	}
	.directory {
		margin-top: 1.429rem;
		.directory_title {
			font-size: 2rem;
			font-weight: 600;
			margin-bottom: 1.429rem;
		}
		.directory_item {
			font-size: 1.1rem;
			margin: 0.714rem 0;
			border-bottom: 1px solid #a1a1a1;
			padding: 1.214rem 0;
			color: #5d5d5d;
		}
	}
	.btn {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 0 - $pagePadding;
		margin-top: 0;
		margin-bottom: 0.357rem;
		border-radius: 1.429rem;
		padding: 0.929rem 0;
		text-align: center;
		background-color: #72bbf8;
		width: 100%;
		.btn_item {
			@include clickActiveAnimation;
			flex: 1;
			.van-icon {
				margin-right: 0.357rem;
			}
		}
		.listenBook {
			.van-icon {
				color: #0032ff;
			}
		}
		.readBook {
			box-sizing: border-box;
			.van-icon {
				color: #22201a;
			}
		}
		.dividing_line {
			width: 0.101rem;
			height: 1.8rem;
			background-color: #8a8383;
		}
		.isadded {
			.icon {
				color: rgb(255, 215, 0);
			}
		}
	}
}
</style>
