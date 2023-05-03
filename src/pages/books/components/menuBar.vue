<template>
	<div :class="classes">
		<div class="function">
			<div class="moreMenu" @click="setCurrentMenu('moreMenu')">
				<van-icon name="apps-o" />
			</div>
			<div class="fontSize" @click="setCurrentMenu('fontSize')">
				<van-icon name="bar-chart-o" />
			</div>
			<div class="theme" @click="setCurrentMenu('themeColor')">
				<van-icon name="flower-o" />
			</div>
			<div class="fontFamily" @click="setCurrentMenu('fontFamily')">
				<van-icon name="font-o" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { currentMenuType } from "@/store/books";
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import classNames from "classnames";
import { ref, watchEffect } from "vue";

const booksStore = useBooks();
const { showBar, currentMenu, showDialog } = storeToRefs(booksStore);
let classes = ref("menuBar");
watchEffect(() => {
	classes.value = classNames("menuBar", {
		"menuBar-show": showBar.value,
		"menuBar-hide": !showBar.value
	});
});
const setCurrentMenu = (type: currentMenuType) => {
	if (currentMenu.value === type && showDialog.value === true) {
		showDialog.value = false;
		return;
	}
	currentMenu.value = type;
	showDialog.value = true;
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/common";

.menuBar {
	@include bookBar;
	bottom: 0;
	border-radius: $raduisWidth $raduisWidth 0 0;
	.function {
		display: flex;
		justify-content: space-around;
		align-content: center;
		color: $themeColor;
		width: 100%;
		font-size: $fontSize;
	}
}

.menuBar-hide {
	bottom: -$barHeight !important;
}

.menuBar-show {
	opacity: 1 !important;
	bottom: 0;
}
</style>
