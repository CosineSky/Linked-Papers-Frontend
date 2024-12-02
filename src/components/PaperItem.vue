<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  paperVO: {
    type: Object,
    required: true
  }
})

const title = ref(props.paperVO.title);

</script>

<template>
	<el-card class="paper-item-card" :body-style="{ padding: '0px' }" shadow="hover">
		<div class="paper-item-main">
			<el-row>{{title.length > 200 ? title.substring(0, 200) + "......" : title}}</el-row>
			<!-- 如果你有其他的属性展示可以在这里加 -->
		</div>
	</el-card>
</template>

<style scoped>
.paper-item-card {
	display: flex;
	align-items: center;
	margin: 20px;
	border-radius: 8px;
	width: 90%;
	height: 80px;
	cursor: pointer; /* 让卡片可点击 */
}

.paper-item-main {
	margin: 20px;
	line-height: 30px;
}
</style>
