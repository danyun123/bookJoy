<template>
	<div class="fontFamily">
		<van-popup v-model:show="showPicker" round position="bottom" @click-overlay="onCancel">
			<van-picker
				title="选择字体"
				:columns="columns"
				@change="onPickerChange"
				@confirm="onConfirm"
				@cancel="onCancel"
				swipe-duration="399"
				v-model="pickerValue"
			/>
		</van-popup>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";

const pickerValue = ref();
const bookStore = useBooks();
const { currentMenu, showDialog, fontFamily } = storeToRefs(bookStore);

const showPicker = ref(false);
const stopWatchCurrentMenu = watch(currentMenu, () => {
	showPicker.value = currentMenu.value === "fontFamily";
});

const onPickerChange = ({ selectedValues }: { selectedValues: any }) => {
	fontFamily.value = selectedValues[0];
};
const columns = [
	{ text: "Default", value: "Default" },
	{ text: "Cabin", value: "Cabin" },
	{ text: "Days One", value: "Days One" },
	{ text: "Montserrat", value: "Montserrat" },
	{ text: "Tangerine", value: "Tangerine" }
];

const onConfirm = () => {
	showPicker.value = false;
	showDialog.value = false;
	currentMenu.value = "";
};
const onCancel = () => {
	onConfirm();
};
onMounted(() => {
	pickerValue.value = [`${fontFamily.value}`];
	stopWatchCurrentMenu();
});
</script>

<style scoped lang="scss">
.fontFamily {
	position: absolute;
	width: 100%;
	bottom: 0;
	z-index: 1000;
	.van-picker {
		border-radius: 10px;
	}
	:deep(.van-picker-column__item) {
		transition: background-color 0.15s ease-in-out;
	}
	:deep(.van-picker-column__item--selected) {
		background-color: #51dfff;
	}
	:deep(.van-overlay) {
		background-color: rgba(20, 20, 20, 0.2);
	}
}
</style>
