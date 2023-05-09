<template>
	<div class="detailed">
		<Brief_info />
		<Flod_directory />
	</div>
</template>

<script setup lang="ts">
import Brief_info from "./detailed_cpms/brief_info/index.vue";
import Flod_directory from "./detailed_cpms/fold_directory/index.vue";
</script>

<style scoped lang="scss">
.detailed {
	height: calc(100% - 54px);
	display: inline-block;
}
</style>
