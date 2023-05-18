<template>
	<div class="app">
		<router-view v-slot="props">
			<keep-alive>
				<Component :is="props.Component"></Component>
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
	width: 100%;
	height: 100%;
	font-size: 1rem;
}
</style>
