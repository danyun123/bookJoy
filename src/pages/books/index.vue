<template>
	<div id="books">
		<Header />
		<NavBar />
		<Content />
		<Dialog />
		<MenuBar />
	</div>
</template>

<script lang="ts" setup>
import Content from "./components/content.vue";
import NavBar from "./components/navBar.vue";
import MenuBar from "./components/menuBar.vue";
import Dialog from "@/pages/books/components/dialog.vue";
import Header from "@/baseUI/header/index.vue";
</script>

<style lang="scss" scoped>
.books {
	width: 100%;
	height: 100%;
}
</style>
