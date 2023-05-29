<template>
	<div class="grouping" v-if="!displayNewGroupPage">
		<van-dialog
			v-model:show="groupingShow"
			title="移动至分组"
			show-cancel-button
			:show-confirm-button="false"
			:confirmButtonDisabled="disabledConfirm"
			@cancel="fist_cancelClick"
		>
			<div class="content">
				<div class="newGroup" @click.stop="newGroup">
					<van-icon name="add-o" />
					<span>新建分组</span>
				</div>
				<div class="groupList" v-if="groupList">
					<template v-for="(item, index) in groupList" :key="index">
						<div class="item" @click="() => groupItemClick(item.name)">
							<van-icon name="points" />
							<span class="name">{{ item.name }}</span>
							<span class="num">共{{ item.bookList.length }}本书</span>
						</div>
					</template>
				</div>
			</div>
		</van-dialog>
	</div>
	<div class="newGroup" v-else>
		<van-dialog
			v-model:show="newGroupingShow"
			title="新建分组"
			show-cancel-button
			@confirm="second_confirmCLick"
			@cancel="second_cancelClick"
			:beforeClose="() => false"
		>
			<van-cell-group inset>
				<van-field
					v-model="newGroupName"
					label="分组名称"
					placeholder="请输入分组名称"
					clearable
					clickable
					:error-message="error_message"
					show-word-limit
					maxlength="12"
				/>
			</van-cell-group>
		</van-dialog>
	</div>
</template>

<script setup lang="ts">
import { onActivated, ref, watchEffect } from "vue";

interface IProps {
	bookList: any[];
}
const props = defineProps<IProps>();
const groupList = ref<any[]>();
const groupingShow = ref(true);
const newGroupingShow = ref(false);
const newGroupName = ref<string>("");
const error_message = ref();
const disabledConfirm = ref(false);
const emits = defineEmits(["closeDialog", "groupItemClick"]);
const displayNewGroupPage = ref(false);
watchEffect(() => {
	groupList.value = props.bookList.filter((item) => {
		if (item.type !== "group") return;
		return item.type === "group";
	});
});
const closeDialog = (isFist: boolean = true) => {
	if (isFist) {
		groupingShow.value = false;
		emits("closeDialog", newGroupName.value);
	} else {
		newGroupingShow.value = false;
	}
};
const groupItemClick = (name: string) => {
	emits("groupItemClick", name);
	groupingShow.value = false;
	newGroupingShow.value = false;
};
const newGroup = () => {
	displayNewGroupPage.value = true;
	newGroupingShow.value = true;
};
const fist_cancelClick = () => {
	closeDialog();
};
const second_confirmCLick = () => {
	const realValue = newGroupName.value.trim();
	if (groupList.value?.findIndex((item) => item.name === realValue) !== -1) {
		error_message.value = "该组名已存在";
		return;
	}
	if (realValue === "") {
		error_message.value = "输入框内容不能为空";
		return;
	} else if (realValue.length > 12 || realValue.length < 2) {
		error_message.value = "组名字数限制 2 ~ 12";
		return;
	}
	closeDialog(true);
};
const second_cancelClick = () => {
	closeDialog(false);
	newGroupName.value = "";
	displayNewGroupPage.value = false;
};
onActivated(() => {
	groupingShow.value = true;
	newGroupName.value = "";
});
</script>

<style scoped lang="scss">
@import "../../../../assets/css/common";
.content {
	padding: 1.014rem 1.786rem;
	.newGroup {
		color: red;
		.van-icon::before {
			margin-right: 5px;
		}
	}
	.groupList {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		max-height: 35vh;
		overflow-y: scroll;

		.item {
			margin: 0.629rem 0;
			&:active {
				background: #f1f1f1;
			}
			.van-icon::before {
				margin-right: 5px;
			}
			.num {
				float: right;
				font-size: 1rem;
				color: $themeGreyColor;
			}
		}
	}
}
</style>
