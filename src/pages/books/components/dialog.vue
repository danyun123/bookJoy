<template>
	<div class="dialog">
		<FontSize />
		<FontFamily />
		<ThemeColor />
		<Progress />
	</div>
</template>

<script setup lang="ts">
import FontSize from "@/components/book_dialog_list/fontSize/index.vue";
import FontFamily from "@/components/book_dialog_list/fontFamily/index.vue";
import ThemeColor from "@/components/book_dialog_list/themeColor/index.vue";
import Progress from "@/components/book_dialog_list/progress/index.vue";
</script>

<style scoped lang="scss"></style>
