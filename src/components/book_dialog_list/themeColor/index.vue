<template>
	<div :class="{ theme: true, show_dialog: currentMenu === 'themeColor' && showDialog }">
		<template v-for="item in entireThemeColor" :key="item.text">
			<div @click="() => handelClickItem(item.text)" :class="{ theme_item: true, select: selectColor === item.text }">
				<div :class="{ item_bg: true, [item.text]: true }"></div>
				<span class="title">{{ item.value }}</span>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { themeColorType } from "@/store/books";
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import { ref } from "vue";
import { entireThemeColor } from "@/assets/data/global";
import { getBooksConfig } from "@/utils/common";

const bookStore = useBooks();
const { currentMenu, showDialog, themeColor } = storeToRefs(bookStore);
const { local_theme_color } = getBooksConfig();
const selectColor = ref(local_theme_color);
const handelClickItem = (text: themeColorType) => {
	themeColor.value = text;
	selectColor.value = text;
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/common.scss";
.theme {
	position: absolute;
	bottom: -13rem;
	height: 10rem;
	display: flex;
	align-content: center;
	justify-content: space-around;
	width: 100%;
	z-index: 999;
	background-color: #c4c2c2;
	padding: 0.714rem 0 0 0;
	border-radius: 10px;
	transition: bottom $transition;
	.theme_item {
		display: flex;
		flex-direction: column;
		align-content: center;
		justify-content: center;
		.item_bg {
			width: 5rem;
			height: 5rem;
		}
		.title {
			margin: 0.657rem auto 0 auto;
		}
		.default {
			background-color: white;
		}
		.wood {
			background-color: rgb(198 124 14);
		}
		.eye_protection {
			background-color: #ececbd;
		}
		.fresh {
			background-color: rgb(193 255 207);
		}
	}
}
.select {
	color: red;
}
.show_dialog {
	bottom: 2.9rem;
}
</style>
