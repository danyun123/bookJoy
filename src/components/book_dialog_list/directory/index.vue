<template>
	<div
		:class="{ directory: true, show_dialog: currentMenu === 'directory' }"
		:style="{ width: pageWidth, height: pageHeight }"
	>
		<div class="mask" @click="currentMenu = ''">
			<div class="content" :style="{ left: '-' + pageWidth }" @click.stop="">
				<component :is="currentCpm" />
				<div class="tabs" v-if="displayCpm !== 'Directory_search'">
					<div
						@click="displayCpm = 'Directory_content'"
						:class="{ main: true, tab_selected: displayCpm === 'Directory_content' }"
					>
						目录
					</div>
					<div
						@click="displayCpm = 'Directory_bookmark'"
						:class="{ bookmark: true, tab_selected: displayCpm === 'Directory_bookmark' }"
					>
						书签
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import Directory_bookmark from "../../menuBar_directory_cpms/directory_bookmark/index.vue";
import Directory_content from "../../menuBar_directory_cpms/directory_content/index.vue";
import useDirectory from "@/store/directory";
import type { Component } from "vue";
import { shallowRef, watchEffect } from "vue";

const pageWidth = innerWidth + "px";
const pageHeight = innerHeight + "px";
const bookStore = useBooks();
const directoryStore = useDirectory();
const { currentMenu } = storeToRefs(bookStore);
const { displayCpm } = storeToRefs(directoryStore);
const currentCpm = shallowRef<Component>();
watchEffect(() => {
	switch (displayCpm.value) {
		case "Directory_bookmark":
			currentCpm.value = Directory_bookmark;
			return;
		case "Directory_content":
			currentCpm.value = Directory_content;
			return;
	}
});
</script>

<style scoped lang="scss">
@import "../../../assets/css/common.scss";
.directory {
	position: absolute;
	z-index: 1000;
	top: 0;
	visibility: hidden;
	transition: visibility $transition;
	.mask {
		width: 100%;
		height: 100%;
		background-color: rgba(101, 101, 101, 0.5);
		display: flex;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
		.content {
			position: absolute;
			top: 0;
			height: 100%;
			background-color: #d7cf96;
			width: 80%;
			transition: left $transition;
			.tabs {
				position: absolute;
				bottom: 0;
				display: flex;
				align-items: center;
				width: 100%;
				border-top: 1px solid #a1a1a1;
				box-sizing: border-box;
				background-color: #e6e6e6;
				& > div {
					width: 50%;
					text-align: center;
					padding: 10px 0;
					transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out;
				}
				.tab_selected {
					background-color: #8a8787;
					color: white;
				}
			}
		}
	}
}

.show_dialog {
	visibility: visible;
	.mask {
		visibility: visible;
		opacity: 1;
		.content {
			left: 0 !important;
		}
	}
}
</style>
