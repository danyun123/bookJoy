import { onMounted, onUnmounted, ref } from "vue";
import throttle from "../throttle";

const scrollListen = (ele: Element) => {
	let doc: Element | Window = window;
	if (ele) doc = ele;
	const isActive = ref(false);
	const scrollTop = ref(0);
	const scrollHeight = ref(0);
	const viewPortHeight = ref(0);
	const scroll = throttle(() => {
		if (doc === window) {
			scrollTop.value = document.documentElement.scrollTop;
			scrollHeight.value = document.documentElement.scrollHeight;
			viewPortHeight.value = document.documentElement.clientHeight;
		} else {
			scrollTop.value = (doc as Element).scrollTop;
			scrollHeight.value = (doc as Element).scrollHeight;
			viewPortHeight.value = (doc as Element).clientHeight;
		}
		if (scrollTop.value + viewPortHeight.value >= scrollHeight.value) {
			isActive.value = true;
		}
	}, 100);
	onMounted(() => {
		doc.addEventListener("scroll", scroll);
	});
	onUnmounted(() => {
		doc.removeEventListener("scroll", scroll);
	});
	return { isActive, scrollTop, scrollHeight, viewPortHeight };
};

export default scrollListen;
