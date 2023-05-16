<template>
	<Vue3Lottie :pauseOnHover="true" :animationData="lottieArr" :height="300" :width="300" />
</template>

<script setup lang="ts">
import * as lotties from "@/assets/lotties/index";

const lottieArr = lotties.book_directory_loading;
</script>
