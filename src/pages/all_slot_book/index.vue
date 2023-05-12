<template>
	<div class="all_sort">
		<div class="title">
			<div class="return" @click="returnClick"><van-icon name="arrow-left" />返回</div>
			<span v-if="chineseName">{{ chineseName }}</span>
			<span v-else>共有{{ bookList.total }}本书</span>
		</div>
		<div class="list">
			<template v-for="(value, key) in realProxyObject(dataList.total ? dataList.data : dataList)" :key="key">
				<span class="sort_far_name" v-if="!chineseName">{{ categoryText(value[0].category)[1] }}</span>
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
				<template v-else v-for="item in value" :key="item.id">
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
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import useHome from "@/store/home";
import { storeToRefs } from "pinia/dist/pinia";
import { useRoute } from "vue-router/dist/vue-router";
import { onBeforeMount, ref, watchEffect } from "vue";
import { categoryText, realProxyObject, strFistWordToUp } from "@/utils/common";
import { useRouter } from "vue-router";

const homeStore = useHome();
const { bookList } = storeToRefs(homeStore);
const { fetchBookList } = homeStore;

const route = useRoute();
const router = useRouter();
let chineseName = ref<string>();
const dataList = ref<any>();
const returnClick = () => {
	router.back();
};
watchEffect(() => {
	if (route.params.name === "allBook") {
		dataList.value = bookList.value;
		return;
	}
	if (Object.keys(bookList.value).length > 0) {
		if (route.params.name) chineseName.value = categoryText(+route.params.name)![1];
		if (route.query?.sort_name) {
			//@ts-ignore
			dataList.value = bookList.value.data[strFistWordToUp((route.query.sort_name as string) ?? "")];
		}
	}
});
const itemClick = (book: any) => {
	router.push({
		path: `/bookDetail/${book.fileName}`,
		query: book
	});
};
onBeforeMount(() => {
	fetchBookList();
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.all_sort {
	padding: 0 0.714rem;
	overflow: scroll;
	height: 100vh;
	.title {
		padding: 0.714rem 0;
		margin: 0 -0.714rem;
		background-color: #d0d0d0;
		position: relative;
		.return {
			display: inline-block;
			margin-left: 0.514rem;
		}
		span {
			position: absolute;
			right: 50%;
			transform: translateX(50%);
			font-size: 1.2rem;
			color: #ef0a0a;
			font-weight: 600;
		}
	}
	.list {
		margin-top: 0.714rem;
		display: flex;
		flex-wrap: wrap;
		.sort_far_name {
			font-size: 1.35rem;
			width: 100% !important;
			color: #6d80ff;
			font-weight: 600;
			margin: 0.714rem 0;
			border-bottom: 1px solid #a9a4a4;
			padding-bottom: 0.571rem;
		}
		.item {
			width: calc(49% - 10px);
			margin: 1.071rem 0;
			display: flex;

			.info {
				width: 70%;
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
			.cover {
				width: 30%;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
		.item:nth-of-type(2n - 1) {
			margin-right: 20px;
		}
	}
}
</style>