<template>
	<div :class="{ progress: true, show_dialog: currentMenu === 'progress' && showDialog }">
		<div class="record">
			<div class="time">
				<div class="text">本次已读:</div>
				<div class="detail_time_percentage">{{ formatTime }}</div>
				<div class="text">分钟</div>
			</div>
			<div class="percentage">
				<div class="text">进度:</div>
				<div class="detail_time_percentage">{{ currentLocationPercentage }}%</div>
			</div>
		</div>
		<div class="switch">
			<div
				:class="{ prev: true, but: true, disabled: !directoryLoadOver || currentSection === 0 }"
				@click="() => handelButClick(false)"
			>
				<van-icon name="arrow-left" />上一章
			</div>
			<div class="loading" v-show="!directoryLoadOver">目录解析中.........</div>
			<div
				:class="{ prev: true, but: true, disabled: !directoryLoadOver || currentSection === maxSectionLength - 1 }"
				@click="handelButClick"
			>
				下一章<van-icon name="arrow" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useBooks from "@/store/books";
import { storeToRefs } from "pinia/dist/pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { showToast } from "vant";

const bookStore = useBooks();
const {
	currentMenu,
	showDialog,
	directoryLoadOver,
	currentSection,
	maxSectionLength,
	currentLocationPercentage,
	presentReadTime,
	entireReadTime
} = storeToRefs(bookStore);
const currentTime = ref(0);
let timeoutID: number | NodeJS.Timer;
onMounted(() => {
	timeoutID = setInterval(() => {
		currentTime.value += 1;
		entireReadTime.value += 1;
	}, 1000);
});
const formatTime = computed({
	set() {},
	get() {
		return Math.floor(currentTime.value / 60);
	}
});
const stopWatchTime = watch([formatTime], () => {
	presentReadTime.value = formatTime.value;
});
onUnmounted(() => {
	clearInterval(timeoutID);
});
const handelButClick = (isNext: boolean = true) => {
	if (isNext) {
		if ((currentSection.value as number) === maxSectionLength.value - 2) {
			showToast({
				message: "下一章节为后记暂不提供跳转",
				duration: 2000,
				closeOnClick: true,
				className: "tips"
			});
		}
		(currentSection.value as number)++;
	} else {
		(currentSection.value as number)--;
	}
};
onUnmounted(() => {
	stopWatchTime();
});
</script>

<style scoped lang="scss">
@import "../../../assets/css/common";

.progress {
	position: absolute;
	bottom: 4.5rem;
	z-index: 1000;
	width: calc(100% - 1.428rem);
	margin: 0 0.714rem;
	padding: 0.714rem 0;
	border-radius: 0.714rem;
	scale: 0.1;
	visibility: hidden;
	opacity: 0;
	background-color: rgba(255, 255, 255, 0.9);
	@include bookFontProgressAnimation;
	.record {
		font-size: 0.8rem;
		display: flex;
		justify-content: space-around;
		width: 100%;
		.time {
			display: flex;
		}
		.percentage {
			display: flex;
		}
		.detail_time_percentage {
			margin: 0 0.357rem;
			color: $themeColor;
			font-size: 1rem;
			line-height: 1rem;
		}
	}
	.switch {
		font-size: 0.9rem;
		display: flex;
		align-content: center;
		flex-wrap: wrap;
		justify-content: space-around;
		margin: 10px 10px 0 10px;
		.but {
			background-color: $themeColor;
			padding: 0.287rem;
			border-radius: 0.857rem;
			color: #393939;
			@include clickActiveAnimation;
		}
		.prev {
			padding-right: 0.5rem;
		}
		.next {
			padding-left: 0.5rem;
		}
		.loading {
			line-height: 1.6rem;
		}
		.title {
			@include displayOneLine;
			line-height: 1.6rem;
			width: 63%;
			text-align: center;
		}
		.disabled {
			@include disabledStyle;
		}
	}
}
.show_dialog {
	scale: 1;
	visibility: visible;
	opacity: 1;
}
</style>
