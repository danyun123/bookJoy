<template>
	<div class="fluctuation">
		<template v-for="(item, index) in fluctuation_arr" :key="index">
			<span :style="{ height: item + 'rem' }"></span>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface IProps {
	isPause: boolean;
}

const props = defineProps<IProps>();
const fluctuation_arr = ref<number[]>([1, 0.5, 0.4, 0.8, 0.2]);

const timeID = ref<NodeJS.Timer>();
const setFluctuation = () => {
	timeID.value = setInterval(() => {
		fluctuation_arr.value = Array.from(new Array(5), () => Number(Math.random().toFixed(1)));
	}, 370);
};
watchEffect(() => {
	if (props.isPause) clearInterval(timeID.value);
	else setFluctuation();
});
</script>

<style scoped lang="scss">
.fluctuation {
	display: flex;
	align-items: center;
	span {
		display: inline-block;
		width: 2px;
		background-color: #ff5b00;
		box-sizing: border-box;
		transition: height 370ms ease-in-out;
		margin-right: 0.297rem;
	}
}
</style>
