<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {getSimilarPaperById} from "../../api/paper";
import PaperItem from "../../components/PaperItem.vue";
import { ElPagination } from "element-plus";
import {router} from '../../router'
import {fullScreenLoading} from "../../utils/visuals";

interface Paper {
  id: number;
  title: string;
}

const route = useRoute();
const id = ref(route.params.paperId as string); // 获取论文ID
const paperId =+ id.value;
const papers = ref<Paper[]>([]); // 存储同类论文列表
const totalPapers = ref(0); // 存储同类论文总数
const currentPage = ref(1); // 当前页码
const papersPerPage = 10;

const fetchSimilarPapers = async () => {
  try {
    const res = await getSimilarPaperById(paperId,currentPage.value);
    console.log(res)
    if (res) {
      papers.value = res.data.essays; // 设置同类论文列表
      totalPapers.value = res.data.total_pages; // 设置总数
    }
  } catch (error) {
    console.error("获取同类论文失败：", error);
  }
};

// 点击论文卡片，跳转到对应的论文界面
function toStoreDetailPage(paperId: Number) {
  router.push("/paperDetail/" + paperId)
}

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchSimilarPapers(); // 根据当前页重新获取论文数据
};

onMounted(() => {
    fetchSimilarPapers();
	fullScreenLoading(2500);
});
</script>

<template>
	<body>
	<div class="paper-list-page">
		<h2 style="text-align: center">同类论文列表</h2>
		<div class="paper-list">
			<PaperItem
				v-for="paper in papers"
				:key="paper.id"
				:paperVO="paper"
				@click="toStoreDetailPage(paper.id)"
			/>
		</div>
		
		<el-pagination
			:current-page="currentPage"
			:page-size="papersPerPage"
			:total="totalPapers"
			@current-change="handlePageChange"
			style="justify-content: center"
			layout="prev, pager, next, jumper"
		/>
	</div>
	</body>

</template>

<style scoped>
.paper-list {
	margin-top: 20px;
	max-height: 500px;
	overflow: auto;
}
body {
	background: linear-gradient(to bottom, #409eff, #ffffff);
}
</style>
