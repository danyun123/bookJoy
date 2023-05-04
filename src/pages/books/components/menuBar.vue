<template>
	<div :class="classes">
		<div class="function">
			<template v-for="item in entireMenubar" :key="item.value">
				<div :class="{ [item.text]: true, menu_item: true }" @click="setCurrentMenu(item.text)">
					<van-icon :name="item.icon" />
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { currentMenuType } from "@/store/books";
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import classNames from "classnames";
import { ref, watchEffect } from "vue";
import { entireMenubar } from "@/assets/data/global";

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
		height: 100%;
		.menu_item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-content: center;
			i {
				display: inline-block;
				line-height: $barHeight;
			}
			@include clickActiveAnimation;
		}
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
