<template>
	<div
		:class="{ fontSize: true, show_dialog: currentMenu === 'fontSize' && showDialog }"
		ref="pageRef"
		:style="{ left: -pageWidth + 'pt' }"
	>
		<div class="title">
			字体大小:
			<span class="sizeNum">{{ fontSize }}</span>
			pt
		</div>
		<van-slider
			v-model="fontSizeValue"
			bar-height="4px"
			active-color="rgb(0,236,255)"
			:step="10"
			@update:model-value="handelSliderChange"
		/>
		<div class="tip">tip: 若字体大小大于 16pt 可能会影响观看体验</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";

const pageRef = ref();
const fontSizeValue = ref();
const pageWidth = ref(0);
const bookStore = useBooks();
const { fontSize, currentMenu, showDialog } = storeToRefs(bookStore);

watchEffect(() => {
	pageWidth.value = Math.ceil(pageRef.value?.offsetWidth / 0.85);
	fontSizeValue.value = (fontSize.value - 12) * 10 + 20;
});

const handelSliderChange = (value: number) => {
	fontSize.value = 12 + (value - 20) / 10;
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/common.scss";

.fontSize {
	position: absolute;
	bottom: 30%;
	width: 85%;
	height: 7rem;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 10px;
	display: flex;
	align-content: center;
	justify-content: center;
	opacity: 0;
	@include bookFontSizeAnimation;
	.title {
		position: absolute;
		top: 1.071rem;
		.sizeNum {
			font-size: 1.2rem;
			margin: 0 15px;
			color: #ec0000;
		}
	}
	.van-slider {
		background-color: #484545;
		transform: translateY(-50%);
		top: 50%;
		width: 80%;
	}
	.tip {
		font-size: 0.857rem;
		position: absolute;
		bottom: 0.429rem;
	}
}
.show_dialog {
	left: 50% !important;
	transform: translateX(-50%) !important;
	opacity: 1 !important;
}
</style>
