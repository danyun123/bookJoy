<template>
	<div class="header">{{ headerText ?? "目录解析中~~" }}</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia/dist/pinia";
import useBooks from "@/store/books";
import { computed } from "vue";

const { entireFlatDirectory, currentSection, directoryLoadOver } = storeToRefs(useBooks());
const headerText = computed({
	get() {
		if (directoryLoadOver.value) {
			return entireFlatDirectory.value[currentSection.value as number].label.match(/[a-zA-Z]+/g).join(" ");
		}
		return null;
	},
	set() {}
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";
.header {
	position: absolute;
	width: 90%;
	top: 0;
	z-index: 2;
	padding: 0.214rem 10% 0.2rem 1.071rem;
	border-bottom: 1px solid $themeGreyColor;
	@include displayOneLine;
	font-size: 0.7rem;
	color: #727272;
	max-height: 2.057rem;
}
</style>
