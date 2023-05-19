<template>
	<Vue3Lottie :pauseOnHover="true" :animationData="lottieArr" :height="150" :width="150" />
</template>

<script setup lang="ts">
import * as lotties from "@/assets/lotties/index";

const lottieArr = lotties.fireworks;
</script>
