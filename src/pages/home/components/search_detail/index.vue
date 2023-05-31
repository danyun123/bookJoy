<template>
	<div class="search_detail">
		<div class="hot_search">
			<Description_head @rightSizeClick="changeBatchClick" title="热门搜索" />
			<TransitionGroup name="list">
				<template v-for="(item, index) in hotSearchList" :key="item.name + index">
					<div class="hot_item" @click="hotItemClick(item.name)">
						<div class="item_icon">
							<van-icon name="fire-o" />
						</div>
						<div class="item_content">
							<div class="name">
								{{ item.name }}
							</div>
							<div class="num">{{ item.num }} 万人搜索</div>
						</div>
					</div>
				</template>
			</TransitionGroup>
		</div>
		<div class="search_history">
			<Description_head title="搜索历史" right="清空" @rightSizeClick="clearHistoryClick" />
			<div class="history_list">
				<template v-for="(item, index) in historyData.toReversed()" :key="item">
					<div class="history_item" @click="() => itemCLick(item)">
						<span class="history_icon">
							<van-icon name="search" />
						</span>
						<span>
							{{ item }}
						</span>
						<span class="history_delete" @click.stop="() => deleteIconClick(index)">
							<van-icon name="cross" />
						</span>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { hotSearch } from "@/assets/data/search_detail";
import { onActivated, onBeforeMount, ref, watch } from "vue";
import { SEARCH_HISTORY } from "@/assets/constant";
import useHome from "@/store/home";
import { storeToRefs } from "pinia/dist/pinia";
import Description_head from "@/baseUI/description_head/index.vue";
import { getRandomArr } from "@/utils/common";
import { useRouter } from "vue-router";

const router = useRouter();
const historyData = ref<string[]>(JSON.parse(localStorage.getItem(SEARCH_HISTORY) ?? "[]"));
const hotSearchList = ref<any[]>(hotSearch.slice(0, 5));
const homeStore = useHome();
const { search_history, insideSearch } = storeToRefs(homeStore);
const emit = defineEmits(["historyItemClick", "searchPageInto"]);

const hotItemClick = (name: string) => {
	router.push(`/bookDetail/${name}`);
};
const changeBatchClick = () => {
	hotSearchList.value = getRandomArr(hotSearch, 5) as any[];
};
const clearHistoryClick = () => {
	localStorage.setItem(SEARCH_HISTORY, JSON.stringify([]));
	historyData.value = [];
};
const deleteIconClick = (index: number) => {
	historyData.value.splice(historyData.value.length - 1 - index, 1);
	localStorage.setItem(SEARCH_HISTORY, JSON.stringify(historyData.value));
};

const itemCLick = (item: string) => {
	router.push({
		path: `/sortBook/home_search`,
		query: {
			searchValue: item
		}
	});
};

watch([search_history], () => {
	historyData.value = search_history.value;
});
onBeforeMount(() => {
	insideSearch.value = true;
	window.onbeforeunload = () => {
		search_history.value = historyData.value;
		localStorage.setItem(SEARCH_HISTORY, JSON.stringify(historyData.value));
	};
});
onActivated(() => {
	emit("searchPageInto", 0);
});
</script>

<style scoped lang="scss">
.search_detail {
	height: calc(100vh - 3.214rem - 10px);
	margin-top: 2.95rem;
	.rightBtn {
		position: absolute;
		right: 0;
		top: 0;
		color: #5e5eff;
	}
	.btn {
		font-size: 1rem;
		font-weight: 600;
	}
	.hot_search {
		position: relative;
		display: flex;
		flex-direction: column;
		margin-bottom: 1.071rem;
		border-bottom: 1px solid #8d8a8a;
		.list-enter-active {
			transition: all 0.7s ease;
		}
		.list-enter-from {
			opacity: 0;
			transform: translateX(30px);
		}
		.hot_item {
			display: flex;
			align-content: center;
			flex-wrap: nowrap;
			margin: 0.514rem 0;
			.item_icon {
				margin-right: 0.714rem;
				font-size: 1.6rem;
				color: red;
				transform: translateY(30%);
			}
			.name {
				margin: 0.714rem 0;
			}
			.num {
				font-size: 0.95rem;
				color: #8c8b8b;
			}
		}
	}
	.search_history {
		position: relative;
		font-size: 1.15rem;
		.history_list {
			margin-top: 1.071rem;
			height: calc(100vh - 33rem);
			overflow: scroll;
			.history_item {
				margin: 1.071rem 0;
				.history_icon {
					font-size: 1.6rem;
					margin-right: 0.714rem;
				}
				.history_delete {
					float: right;
					:deep(.van-badge__wrapper) {
						border: 1px solid #e55353;
						color: #e55353;
						border-radius: 50%;
					}
				}
			}
		}
	}
}
</style>
