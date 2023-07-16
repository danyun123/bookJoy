<template>
	<div class="app">
		<router-view v-slot="props">
			<keep-alive>
				<component :is="props.Component"></component>
			</keep-alive>
		</router-view>
		<Tabbar v-if="$route.meta.displayTabbar" />
	</div>
</template>

<script lang="ts" setup>
import Tabbar from "./baseUI/tabbar/index.vue";
</script>

<style lang="scss" scoped>
.app {
	width: 100%;
	height: 100vh;
	font-size: 1rem;
}
</style>
