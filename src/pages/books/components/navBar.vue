<template>
	<div :class="classes">
		<div class="back">
			<van-icon name="arrow-left" size="1.6rem" />
			<span>返回</span>
		</div>
		<div class="function">
			<div class="bookshelf fun_item" title="书架">
				<van-icon name="paid" />
			</div>
			<div class="shoppingCar fun_item" title="购物车">
				<van-icon name="shopping-cart-o" />
			</div>
			<div class="more fun_item" title="更多">
				<van-icon name="descending" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import classNames from "classnames";
import { ref, watchEffect } from "vue";

const booksStore = useBooks();
const { showBar } = storeToRefs(booksStore);
let classes = ref("navBar");
watchEffect(() => {
	classes.value = classNames("navBar", {
		"navBar-show": showBar.value,
		"navBar-hide": !showBar.value
	});
});
</script>

<style lang="scss" scoped>
@import "../../../assets/css/common";

.navBar {
	@include bookBar();
	top: 0;
	border-radius: 0 0 $raduisWidth $raduisWidth;
	.back {
		color: $themeColor;
		margin-left: 0.5rem;
		display: flex;
		align-content: center;
		justify-content: center;
		line-height: 1.6rem;
	}
	.function {
		display: flex;
		justify-content: space-around;
		.fun_item {
			margin: 0 2.6rem;
			font-size: $fontSize;
			color: $themeColor;
		}
		.fun_item:last-child {
			margin-right: 0.6rem;
		}
	}
}

.navBar-hide {
	top: -$barHeight !important;
}

.navBar-show {
	opacity: 1 !important;
	top: 0;
}
</style>