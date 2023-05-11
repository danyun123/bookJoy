<template>
	<div class="app">
		<router-view v-slot="props">
			<keep-alive>
				<component :is="props.Component"></component>
			</keep-alive>
		</router-view>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.app {
	width: 100%;
	height: 100%;
	font-size: 1rem;
}
</style>
