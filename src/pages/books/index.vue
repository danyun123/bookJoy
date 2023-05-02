<template>
	<div id="books">
		<NavBar />
		<Content />
		<MenuBar />
	</div>
</template>

<script lang="ts" setup>
import Content from "./components/content.vue";
import NavBar from "./components/navBar.vue";
import MenuBar from "./components/menuBar.vue";
</script>

<style lang="scss" scoped></style>
