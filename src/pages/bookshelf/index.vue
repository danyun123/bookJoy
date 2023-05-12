<template>
	<div class="bookshelf">
		<div class="head">
			<div class="clearAll" v-if="isEditing && books.length > 0" @click="clearAll">清空书架</div>
			<div class="title">书架</div>
			<div class="edit" @click="editClick" v-if="books.length > 0">
				<span v-if="!isEditing">编辑</span>
				<span v-else>取消编辑</span>
			</div>
		</div>
		<div class="content">
			<template v-for="item in books" :key="item._value.id">
				<div :class="{ item: true, shake: isEditing }" @click="() => bookClick(item._value)">
					<div class="cover">
						<img :src="item._value.cover" alt="图片加载错误" />
					</div>
					<div class="author">
						{{ item._value.author }}
					</div>
					<div class="delete" v-if="isEditing" @click.stop="() => deleteBtnClick(item._value.fileName)">
						<van-icon name="cross" />
					</div>
				</div>
				<div class="remind" v-if="books.length === 0">您还未收藏电子书，快去逛逛吧！</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { ALLBOOKSHELFNAME, BOOKSHELF } from "@/assets/constant";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router/dist/vue-router";

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const books = ref(JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]"));
const bookClick = (data: any) => {
	router.push({
		path: `/bookDetail/${data.fileName}`,
		query: data
	});
};

const editClick = () => {
	isEditing.value = !isEditing.value;
};
const deleteBtnClick = (name: any) => {
	const datas = JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]");
	const names = JSON.parse(localStorage.getItem(ALLBOOKSHELFNAME) ?? "[]");
	datas.splice(
		datas.findIndex((item: any) => item._value.fileName === name),
		1
	);
	names.splice(
		names.findIndex((item: string) => item === name),
		1
	);
	localStorage.setItem(BOOKSHELF, JSON.stringify(datas));
	localStorage.setItem(ALLBOOKSHELFNAME, JSON.stringify(names));
	books.value = datas;
};
const clearAll = () => {
	localStorage.setItem(BOOKSHELF, "[]");
	localStorage.setItem(ALLBOOKSHELFNAME, "[]");
	books.value = JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]");
};
watchEffect(() => {
	isEditing.value = false;
	if (route.path === "/bookshelf") {
		books.value = JSON.parse(localStorage.getItem(BOOKSHELF) ?? "[]");
	}
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.bookshelf {
	padding: 0 $pagePadding;
	height: calc(100vh - 2.428rem);
	overflow: scroll;
	.head {
		position: relative;
		margin-top: 1.214rem;
		height: 2.5rem;
		border-bottom: 1px solid $themeGreyColor;
		.title {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			font-size: 1.2rem;
		}
		.clearAll {
			position: absolute;
			left: 0;
			top: 0;
			color: #bb1616;
		}
		.edit {
			position: absolute;
			right: 0;
			font-size: 1rem;
			color: $themeColor;
		}
	}
	.content {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.item {
			width: calc(50% - 0.536rem);
			margin: 0.871rem 0;
			position: relative;
			.cover {
				width: 100%;
				height: 100%;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.author {
				@include displayMultiline();
				height: 2.4rem;
			}
			.delete {
				position: absolute;
				top: -5px;
				right: -5px;
				:deep(.van-badge__wrapper) {
					border: 1px solid #ee0000;
					color: white;
					background-color: red;
					border-radius: 50%;
				}
			}
		}
		.item:nth-child(2n - 1) {
			margin-right: 1.071rem;
		}
		.shake {
			animation: $shakeAnimation;
		}
	}
	.remind {
		@include remindInfo;
	}
}
</style>
