<template>
	<div class="app">
		<router-view v-slot="props">
			<keep-alive>
				<component :is="props.Component"></component>
			</keep-alive>
		</router-view>
		<Tabbar v-if="!$route.meta.hideTabbar ?? false" />
	</div>
</template>

<script setup>
import Tabbar from "./baseUI/tabbar/index.vue";
</script>

<style lang="scss" scoped>
.app {
	width: 100vw;
	height: 100vh;
	font-size: 1rem;
}
</style>
