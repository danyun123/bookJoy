<template>
	<div class="brief">
		<div class="cover">
			<img :src="currentBookCover" alt="图书封面" />
		</div>
		<div class="metaData">
			<div class="name">
				{{ currentBookMetaData.title }}
			</div>
			<div class="author">
				{{ currentBookMetaData.creator }}
			</div>
		</div>
		<div class="progress">
			<div class="progress_text">已读</div>
			<div class="percentage progress_variable">{{ Math.floor(entireReadTime / 60) }}分钟</div>
			<div class="progress_text">进度</div>
			<div class="time progress_variable">{{ currentLocationPercentage }}%</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";

const bookStore = useBooks();
const { currentBookCover, currentBookMetaData, currentLocationPercentage, entireReadTime } = storeToRefs(bookStore);
</script>

<style scoped lang="scss">
@import "../../../../../assets/css/common";

.brief {
	font-size: 0.8rem;
	display: flex;
	height: 11.5%;
	border-bottom: 1px solid #a1a1a1;
	padding: 0.714rem;
	.cover {
		height: 100%;
		width: 18%;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.metaData {
		margin: 0 0.314rem 0 0.714rem;
		max-width: 60%;
		width: auto;
		height: auto;
		.name {
			@include displayMultiline();
			margin-bottom: 1.429rem;
		}
		.author {
			@include displayMultiline();
		}
	}
	.progress {
		text-align: center;
		.progress_text {
			margin: 5px 0;
		}
		.progress_text:first-child {
			margin-top: 0;
		}
		.progress_variable {
			text-align: center;
			color: $themeColor;
		}
	}
}
</style>
