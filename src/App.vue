<template>
  <div class="app">
		<router-view v-slot="props">
			<keep-alive>
				<component :is="props.Component"></component>
			</keep-alive>
		</router-view>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.app {
	font-size: 1rem;
}
</style>
