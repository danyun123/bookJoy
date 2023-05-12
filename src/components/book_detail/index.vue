<template>
	<div class="detail">
		<div class="return" @click="returnClick"><van-icon name="arrow-left" />返回</div>
		<div class="head">
			<div class="cover">
				<img :src="data.cover" alt="图片加载错误" />
			</div>
			<div class="text">
				<div class="name">{{ data.fileName }}</div>
				<div class="author">{{ data.author }}</div>
				<div class="description">{{ data.title }}</div>
			</div>
		</div>
		<div class="copyright">
			<div class="title_v1">版权</div>
			<div class="publisher clo">
				<div class="title">出版社:</div>
				<div class="title_info">{{ data.publisher }}</div>
			</div>
			<div class="sort clo">
				<div class="title">分类:</div>
				<div class="title_info">{{ data?.categoryText ?? categoryText(+data?.category)[0] }}</div>
			</div>
			<div class="lang clo">
				<div class="title">语言:</div>
				<div class="title_info">en</div>
			</div>
		</div>
		<div class="btn">
			<div class="readBook" @click="readClick">立即阅读</div>
			<div :class="{ addBook: true, isadded: isAdded }" @click="addBook">
				<span v-if="isAdded">
					<span class="icon">
						<van-icon name="star" />
					</span>
					已在书架中
				</span>
				<span v-else>加入书架</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/dist/vue-router";
import { useRouter } from "vue-router";
import { categoryText, strFistWordToUp } from "@/utils/common";
import { onBeforeMount, ref, watchEffect } from "vue";
import { ALLBOOKSHELFNAME, BOOKSHELF } from "@/assets/constant";

const router = useRouter();
const route = useRoute();
const data = ref();
const bookName = ref();
const isAdded = ref();
const returnClick = () => {
	router.back();
};
const readClick = () => {
	router.push({
		path: `/books/${strFistWordToUp(data.value.categoryText ?? categoryText(+data.value.category)![0])}/${
			data.value.fileName
		}.epub`
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
		books.splice(
			books.findIndex((item: any) => item._rawValue.fileName === bookName.value),
			1
		);
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify(names));
		localStorage.setItem(BOOKSHELF, JSON.stringify(books));
	} else {
		localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify([...names, bookName.value]));
		localStorage.setItem(BOOKSHELF, JSON.stringify([...books, data]));
	}
	isAdded.value = !isAdded.value;
};
onBeforeMount(() => {
	const names = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
	isAdded.value = names.includes();
});
watchEffect(() => {
	const names = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
	data.value = route.query;
	bookName.value = data.value.fileName;
	isAdded.value = names.includes(bookName.value);
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.detail {
	padding: 0.714rem $pagePadding;
	.return {
		display: inline-block;
		margin-left: -0.414rem;
		font-size: 1.2rem;
	}
	.head {
		display: flex;
		width: 100%;
		border-bottom: 1px solid #cccaca;
		padding: 0.714rem $pagePadding 30px $pagePadding;
		margin: 0 -$pagePadding;
		margin-top: 1.143rem;
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
	}
	.copyright {
		margin-top: 40px;
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
	.btn {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		margin: 0 -$pagePadding;
		margin-top: 0;
		margin-bottom: 0.357rem;
		border-radius: 1.429rem;
		padding: 0.929rem 0;
		text-align: center;
		background-color: #72bbf8;
		width: 100%;
		.readBook {
			flex: 1;
			box-sizing: border-box;
			border-right: 1px solid red;
			@include clickActiveAnimation;
		}
		.addBook {
			flex: 1;
			@include clickActiveAnimation;
		}
		.isadded {
			.icon {
				color: rgb(255, 215, 0);
			}
		}
	}
}
</style>
