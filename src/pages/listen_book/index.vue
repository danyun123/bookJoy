<template>
	<div class="listen_book">
		<Head_return />
		<div
			class="cover"
			:style="{ backgroundImage: `url(${bookData?.cover})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"
		>
			<div class="mask">
				<div class="section">
					<van-notice-bar
						class="scroll_text"
						color="#FFFF"
						scrollable
						background="transparent"
						:text="
							entireDirectory &&
							currentSection - 1 + '. ' + entireDirectory[currentSection - 1].label.replace(/[0-9.]/g, '')
						"
					/>
				</div>
				<div class="description">{{ bookData?.title }}</div>
			</div>
		</div>
		<div class="audio">
			<div class="progress">
				<input
					:value="currentTime"
					type="range"
					:max="totalTime"
					min="0"
					step="1"
					@change="(e) => inputRangeChange(e)"
				/>
				<div class="time">
					<div class="currentTime">{{ formatCurrentTime }}</div>
					<div class="pageNUm">
						<div v-if="loading">
							<van-loading color="#ff008a">
								<template #icon>
									<van-icon name="star-o" size="30" color="#ff008a" />
								</template>
								加载中...
							</van-loading>
						</div>
						<div v-else @click.stop="displayPageIndexTip">
							{{ currentSectionVoiceIndex + " / " + currentSectionTotalVoiceNum + " p" }}
						</div>
					</div>
					<div class="totalTime">{{ formatTotalTime }}</div>
				</div>
			</div>
			<div :class="{ controller: true }">
				<div class="speed_retreat speed audio_item" @click="() => forwardClick(-15)">
					<van-icon class="iconfont" class-prefix="icon" name="forward-reverse" />
					<span>15s</span>
				</div>
				<div class="play_controls">
					<div
						:class="{ prev: true, audio_item: true, disabled: currentSection === 2 && currentSectionVoiceIndex === 1 }"
						@click="switchVoice(false)"
					>
						<van-icon class="iconfont" class-prefix="icon" name="duomeitikongjianMultimediaControls3" />
					</div>
					<div :class="{ pause: true, audio_item: true, disabled: loading }" @click="pauseBtnClick">
						<van-icon v-if="pause" class="iconfont" class-prefix="icon" name="duomeitikongjianMultimediaControls6" />
						<van-icon v-else class="iconfont" class-prefix="icon" name="duomeitikongjianMultimediaControls7" />
					</div>
					<div
						:class="{
							next: true,
							audio_item: true,
							disabled:
								currentSection === entireDirectory?.length && currentSectionVoiceIndex === currentSectionTotalVoiceNum
						}"
						@click="switchVoice(true)"
					>
						<van-icon class="iconfont" class-prefix="icon" name="duomeitikongjianMultimediaControls4" />
					</div>
				</div>
				<div class="speed_advance speed audio_item" @click="() => forwardClick(15)">
					<van-icon class="iconfont" class-prefix="icon" name="forward" />
					<span>15s</span>
				</div>
			</div>
		</div>
		<div class="moreCpm">
			<div class="original_text moreCom_item" @click="() => changeCpmItem(true, 'originalText')">
				<van-icon class="iconfont" class-prefix="icon" name="navicon-wzgl" />
				<span>原文</span>
			</div>
			<div class="sections moreCom_item" @click="() => changeCpmItem(true, 'section')">
				<van-icon class="iconfont" class-prefix="icon" name="zhangjiekecheng" />
				<span>{{ entireDirectory?.length - 1 }}章</span>
			</div>
		</div>
	</div>
	<div class="displayDialog">
		<div
			:class="{ displayDialog_mark: true, show_displayDialog_mark: displayDialog }"
			@click="() => changeCpmItem(false)"
		></div>
		<div
			:class="{ displayDialog_content: true, show_displayDialog: displayDialog }"
			:style="{ backgroundColor: moreCpmValue === 'section' ? 'white' : '#e9ec93' }"
		>
			<div class="dialog_content">
				<div class="displayDialog_content_head">
					<div class="displayDialog_content_head_return" @click.stop="() => changeCpmItem(false)">
						<van-icon name="arrow-down" />
					</div>
					<div class="displayDialog_content_head_title">{{ dialogHeadTitle }}</div>
				</div>
				<div class="section_list" v-if="moreCpmValue === 'section'">
					<template v-for="(item, index) in entireDirectory" :key="item.id">
						<div
							:class="{ directory_item: true, disabled: index === 0 }"
							:style="{
								paddingLeft: item.level * 0.7 + 'rem',
								color: index + 1 === currentSection ? '#ff5b00' : '#212020'
							}"
							@click="() => directoryItemClick(index)"
						>
							<Audio_fluctuation v-if="index + 1 === currentSection && index !== 0" :isPause="pause" />
							<span>
								{{ index + ". " + item.label.replace(/[0-9.]/g, "") }}
							</span>
							<span v-if="index === 0">（封面）</span>
						</div>
					</template>
				</div>
				<div class="original_text_content" v-else-if="moreCpmValue === 'originalText'">
					{{ sectionTextArr[currentSectionVoiceIndex - 1] }}
				</div>
			</div>
		</div>
	</div>
	<div :class="{ pageIndexTips: true, displayPageIndexTips: pageIndexTips }">
		由于讯飞平台一次性支持传入的字符有限，因此将一章中的内容分割为更多的小章节
	</div>
	<!--    播放器-->
	<audio ref="audioRef" @loadedmetadata="handelVoiceLoadOver" @timeupdate="handelTimeUpdate" @ended="audioPlayEnd" />
	<!--    书籍挂载节点，用于获取书籍详细信息-->
	<div
		id="virtualBook"
		style="
			 {
				display: inline-block;
				position: absolute;
				top: 0;
				left: 100vw;
				height: 100vh;
				overflow: hidden;
				z-index: 0;
			}
		"
	></div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/dist/vue-router";
import { computed, onActivated, ref, watch, watchEffect } from "vue";
import Epub from "epubjs";
import { flatNavArr } from "@/utils/bookContent";
import useBookDetail from "@/store/bookDetail";
import { storeToRefs } from "pinia/dist/pinia";
import Head_return from "@/baseUI/head_return/index.vue";
import Audio_fluctuation from "@/baseUI/audio_fluctuation/index.vue";
import { showToast } from "vant";
import { formatTime } from "@/utils/common";
import throttle from "@/utils/throttle";

type moreCpmType = "section" | "originalText";

const pageIndexTips = ref(false);
const bookDetailStore = useBookDetail();
const { bookData } = storeToRefs(bookDetailStore);
const parseOverBook = ref();
const directoryLoadOver = ref(false);
const bookName = ref();
const entireDirectory = ref();
const currentSection = ref(2);
const audioRef = ref<HTMLAudioElement>();
const route = useRoute();
const pause = ref(true);
const displayDialog = ref(false);
const rendition = ref();
const sectionText = ref<string>();
const bookMetaData = ref();
const language = ref("en");
const totalTime = ref(0);
const currentTime = ref(0);
const loading = ref(true);
const textParseing = ref(false);
const getTextOver = ref(false);
const sectionTextArr = ref<string[]>([]);
const currentSectionTotalVoiceNum = ref(0);
const currentSectionVoiceIndex = ref(1);
const moreCpmValue = ref<moreCpmType | undefined>();
const playPercentage = ref(0);

const changeCpmItem = (enter: boolean, name?: moreCpmType) => {
	if (enter) {
		moreCpmValue.value = name;
		displayDialog.value = true;
	} else {
		moreCpmValue.value = undefined;
		displayDialog.value = false;
	}
};
const displayPageIndexTip = () => {
	pageIndexTips.value = true;
	setTimeout(() => {
		pageIndexTips.value = false;
	}, 2000);
};
const dialogHeadTitle = computed(() => {
	switch (moreCpmValue.value) {
		case "originalText": {
			return `第${currentSection.value - 1}章${currentSectionVoiceIndex.value}页`;
		}
		case "section": {
			return `章节`;
		}
		default: {
			return "";
		}
	}
});
const formatTotalTime = computed(() => {
	return formatTime(totalTime.value);
});
const formatCurrentTime = computed(() => {
	return formatTime(currentTime.value);
});
const handelVoiceLoadOver = () => {
	totalTime.value = Math.floor(audioRef.value?.duration!);
	loading.value = false;
};
const handelTimeUpdate = throttle(() => {
	currentTime.value = Math.floor(audioRef.value?.currentTime!);
	playPercentage.value = Math.floor((currentTime.value / totalTime.value) * 100);
}, 500);
const switchVoice = (isNext: boolean) => {
	const newIndex = isNext ? currentSectionVoiceIndex.value + 1 : currentSectionVoiceIndex.value - 1;
	if (newIndex > currentSectionTotalVoiceNum.value) {
		currentSection.value++;
	} else if (newIndex === 0) {
		currentSection.value--;
	} else {
		currentSectionVoiceIndex.value = newIndex;
	}
	pause.value = false;
};
const forwardClick = (time: number) => {
	const handledTime = currentTime.value + time;
	if (handledTime < 0) {
		audioRef.value!.currentTime = 0;
		currentTime.value = 0;
	} else if (handledTime > totalTime.value) {
		audioRef.value!.currentTime = totalTime.value;
		currentTime.value = totalTime.value;
	} else {
		audioRef.value!.currentTime += time;
		currentTime.value += time;
	}
};
// 播放完毕
const audioPlayEnd = () => {
	switchVoice(true);
};
// 手动点击进度条
const inputRangeChange = (e: Event) => {
	currentTime.value = (e.target as any).value;
	audioRef.value!.currentTime = currentTime.value;
};

const resetAudio = () => {
	pause.value = true;
	getTextOver.value = false;
	loading.value = true;
	textParseing.value = true;
	sectionText.value = "";
	sectionTextArr.value = [];
	currentSectionTotalVoiceNum.value = 0;
	currentSectionVoiceIndex.value = 1;
};

const directoryItemClick = (index: number) => {
	displayDialog.value = false;
	currentSection.value = index + 1;
};
// 将书挂载到页面上
const displayBook = () => {
	rendition.value = parseOverBook.value.renderTo("virtualBook", {
		width: innerWidth,
		height: innerHeight,
		method: "default",
		script: "allow-scripts"
	});
	rendition.value.display();
};
// 获取章节内容
const speak = (sectionIndex: number) => {
	const sectionHref = parseOverBook.value.spine.get(sectionIndex).href;
	rendition.value.display(sectionHref).then(async (section: any) => {
		const currentFistPage = rendition.value.currentLocation();
		const currentSectionTotalPageNum = currentFistPage.start.displayed.total;
		for (let i = 0; i < currentSectionTotalPageNum; i++) {
			const currentPage = rendition.value.currentLocation();
			const cfiBase = section.cfiBase;
			const cfiStart = currentPage.start.cfi.replace(/.*!/, "").replace(/\)/, "");
			const cfiEnd = currentPage.end.cfi.replace(/.*!/, "").replace(/\)/, "");
			const cfi = `epubcfi(${cfiBase}!,${cfiStart},${cfiEnd})`;
			parseOverBook.value.getRange(cfi).then((range: any) => {
				let text = range.toLocaleString();
				// 去除所有的空格、回车符、换行符、制表符、换页符
				text = text.replace(/\s(2,)/g, "");
				text = text.replace(/\r/g, "");
				text = text.replace(/\n/g, "");
				text = text.replace(/\t/g, "");
				text = text.replace(/\f/g, "");
				sectionText.value += text;
			});
			await rendition.value.next();
		}
		sectionText.value = `第${sectionIndex}章 ` + sectionText.value;
		getTextOver.value = true;
	});
};
// 将文字转换为音频
const createVoice = (text: string, isFirst: boolean) => {
	// 使用 axios在苹果端出错
	const XML = new XMLHttpRequest();
	// 初始化请求
	XML.open(
		"GET",
		`${import.meta.env.VITE_PARSE_VOICE_URL}/voice?text=${text}&lang=${language.value.toLowerCase()}`,
		true
	);
	// 发送请求
	XML.send();
	// 监听请求状态
	XML.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			const response = XML.responseText;
			if (response) {
				const resObj = JSON.parse(response);
				const voiceUrl = resObj.path;
				if (voiceUrl) {
					audioRef.value!.src = voiceUrl;
					audioRef.value!.pause();
					if (!isFirst) audioRef.value!.play();
				} else {
					showToast({
						message: `获取失败请重试`,
						duration: 1000,
						closeOnClick: true
					});
				}
			} else {
				showToast({
					message: `获取失败请重试`,
					duration: 1000,
					closeOnClick: true
				});
			}
		}
	};
};
// 暂停播放按钮点击
const pauseBtnClick = () => {
	pause.value = !pause.value;
	if (pause.value)
		// 暂停播放
		audioRef.value?.pause();
	else audioRef.value?.play();
};
const parseBook = (opf?: string | null, local_blob?: Blob) => {
	if (opf!.length) {
		parseOverBook.value = Epub(opf!);
	} else {
		// todo
	}
	parseOverBook.value.loaded.metadata.then((metadata: any) => {
		bookMetaData.value = metadata;
		language.value = metadata.language;
	});
	parseOverBook.value.loaded.navigation.then((nav: any) => {
		entireDirectory.value = flatNavArr(nav.toc);
		directoryLoadOver.value = true;
	});
};

const fetchBookData = () => {
	bookName.value = route.path.split("/")[2];
	//@ts-ignore
	bookDetailStore.fetchBookData(bookName.value);
};

onActivated(() => {
	const opf = route.query.opf;
	if (opf) {
		// 本地没有下载
		parseBook(opf as string);
	} else {
		// todo
	}
	fetchBookData();
	displayBook();
	resetAudio();
});
watch([entireDirectory, rendition], () => {
	if (entireDirectory.value && rendition.value) {
		speak(1);
	}
});
watchEffect(() => {
	if (getTextOver.value) {
		sectionTextArr.value = [];
		const length = sectionText.value!.length;
		let currentSize = 0;
		while (currentSize < length) {
			const item = sectionText.value!.slice(currentSize, currentSize + 900);
			currentSize = currentSize + 900 >= length ? length : currentSize + 900;
			sectionTextArr.value.push(item);
		}
		currentSectionTotalVoiceNum.value = sectionTextArr.value.length;
		currentSectionVoiceIndex.value = 1;
		textParseing.value = false;
		audioRef.value?.pause();
	}
});
watch([currentSection], () => {
	resetAudio();
	speak(currentSection.value - 1);
});
watchEffect(() => {
	if (!textParseing.value) {
		createVoice(sectionTextArr.value[0], true);
	}
});
watch([currentSectionVoiceIndex], () => {
	createVoice(sectionTextArr.value[currentSectionVoiceIndex.value - 1], false);
});
</script>

<style scoped lang="scss">
@import "../../assets/css/common";

.listen_book {
	background-color: #bdb447;
	padding: 0.714rem $pagePadding;
	box-sizing: border-box;
	height: 100vh;
	overflow-y: scroll;
	overflow-x: hidden;
	position: relative;

	.cover {
		position: relative;
		width: 16.429rem;
		height: 18.857rem;
		margin: 2.429rem auto 0 auto;
		border-radius: 0.714rem;
		overflow: hidden;
		z-index: 9;
		box-shadow: 0 6px 9px -1px black;

		.mask {
			position: absolute;
			bottom: 0;
			height: 35%;
			width: 100%;
			box-shadow: 0 -0.357rem 0.714rem 0.714rem rgba(213, 168, 68, 0.5);
			background-image: linear-gradient(rgba(196, 193, 183, 0.4) 5%, rgba(213, 168, 68, 0.7), rgb(211 174 70));
			color: white;
			font-weight: 600;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 0 0 1.229rem;

			.section {
				z-index: 10;
				width: 100%;

				.scroll_text {
					font-size: 1.1rem;
					margin-left: -1.229rem;
				}
			}

			.description {
				z-index: 10;
				margin-top: 0.514rem;
				font-size: 0.9rem;
				width: calc(100% - 1.229rem);
				@include displayOneLine;
			}
		}
	}

	.audio {
		width: 100%;
		margin-top: 10vh;
		position: relative;

		.audio_item {
			@include clickActiveAnimation;
		}

		.progress {
			input[type="range"] {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				width: 85%;
				height: 0.714rem;
				border-radius: 0.357rem;
			}

			.time {
				width: 85%;
				display: flex;
				top: 1.714rem;
				justify-content: space-between;
				position: relative;
				left: 50%;
				transform: translateX(-50%);

				.pageNum {
					font-size: 0.9rem;
				}
			}
		}

		.controller {
			position: relative;
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 3.5rem;
			font-size: 1.4rem;
			width: 100%;

			.speed {
				width: auto;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				span {
					font-size: 1rem !important;
				}
			}

			.speed_retreat,
			.speed_advance {
				span {
					font-size: 1.2rem;
				}
			}

			.play_controls {
				display: flex;
				align-items: center;
				color: #1a1919;

				.icon-forward-reverse {
					text-align: center;
				}

				.icon::before {
					font-size: 3.5rem !important;
				}

				.icon-duomeitikongjianMultimediaControls7,
				.icon-duomeitikongjianMultimediaControls6 {
					margin: 0 20px;

					&::before {
						font-size: 4.5rem !important;
					}
				}
			}
		}
	}

	.audioDisabled {
		@include disabledStyle;
	}

	.moreCpm {
		position: relative;
		z-index: 10;
		margin-top: 2rem;
		width: 100%;
		display: flex;
		justify-content: space-around;

		.moreCom_item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;

			.icon {
				font-weight: 600;
				font-size: 1.5rem;
			}
		}
	}
}

.displayDialog {
	.displayDialog_mark {
		height: 100vh;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.5);
		position: absolute;
		z-index: 15;
		display: none;
		bottom: 0;
	}

	.show_displayDialog_mark {
		display: inline-block !important;
	}

	.displayDialog_content {
		position: absolute;
		z-index: 16;
		width: 100vw;
		height: 87vh;
		bottom: -100%;
		box-sizing: border-box;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		transition: bottom $transition;
		padding: $pagePadding;

		.displayDialog_content_head {
			color: $themeColor;
			display: flex;

			.displayDialog_content_head_return {
				font-size: 1.3rem;
			}

			.displayDialog_content_head_title {
				font-size: 1.1rem;
				position: relative;
				left: calc(50% - #{$pagePadding});
				transform: translateX(-50%);
			}
		}

		.dialog_content {
			overflow: scroll;
			height: 100%;
		}

		.section_list {
			margin-top: 2.857rem;

			.directory_item {
				border-bottom: 1px solid #aba4a4;
				padding: 1.071rem 0;
				color: #212020;
				font-size: 1.1rem;
				display: flex;
				box-sizing: border-box;
			}
		}

		.original_text_content {
			margin-top: 1.5rem;
			line-height: 40px;
			word-spacing: 0.8rem;
		}
	}

	.show_displayDialog {
		bottom: 0;
	}
}

.disabled {
	@include disabledStyle;
}

.pageIndexTips {
	position: fixed;
	bottom: 30%;
	width: 40vw;
	left: -50%;
	padding: 0.714rem;
	line-height: 1.5;
	z-index: 999;
	background-color: white;
	border-radius: 15px;
	letter-spacing: 1.5px;
	transition: left $transition, transform $transition;
}

.displayPageIndexTips {
	left: 50%;
	transform: translateX(-50%);
}
</style>
