<template>
	<template v-for="item in IProps.data" :key="item.id">
		<van-collapse-item
			:noChild="item.subitems.length === 0"
			:title="item.label"
			:name="strToNum(item.id)"
			:is-link="item.subitems.length !== 0"
			:readonly="true"
			@click.stop="(e) => handelClick(e, item.id)"
			:class="{
				selected: strToNum(item.id) - 1 === currentSection,
				childSelected: isChildSelected(currentSection, item.subitems)
			}"
		>
			<template v-if="item.subitems.length !== 0">
				<Fold_recursion :data="item.subitems" />
			</template>
		</van-collapse-item>
	</template>
</template>

<script setup lang="ts">
import { strToNum } from "@/utils/common";
import useBooks from "@/store/books";
import { storeToRefs } from "pinia";
import { isChildSelected } from "@/utils/bookContent";
import throttle from "@/utils/throttle";

interface IPropsType {
	data: any[];
}

const bookStore = useBooks();
const { directorySelected, currentSection } = storeToRefs(bookStore);
const IProps = defineProps<IPropsType>();
const handelClick = throttle((e: Event, sectionId: string) => {
	if (
		(e.target as (EventTarget & { className: string }) | null)?.className ===
			"van-badge__wrapper van-icon van-icon-arrow van-cell__right-icon" ||
		sectionId === directorySelected.value
	)
		return;
	directorySelected.value = sectionId;
	currentSection.value = strToNum(sectionId) - 1;
}, 1000);
</script>

<style scoped lang="scss">
@import "../../../../../assets/css/common";

.van-collapse-item[noChild="true"] {
	:deep(.van-collapse-item__wrapper) {
		display: none;
	}
}
.van-collapse-item {
	border-bottom: 0.123rem solid #bec5be;
}
.van-collapse-item:last-child {
	border-bottom: none;
}
.selected > :deep(.van-collapse-item__title) {
	background-color: $themeColor !important;
	color: white;
}
.childSelected > :deep(.van-collapse-item__title) {
	background: #a9a7a7;
}
</style>
