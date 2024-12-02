<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCitedPaperById} from "../../api/paper";
import PaperItem from "../../components/PaperItem.vue";
import { ElPagination } from "element-plus";

// 定义 Paper 接口
interface Paper {
  id: number;
  title: string;
}

const route = useRoute();
const id = ref(route.params.paperId as string); // 获取论文ID
const paperId =+ id.value;
const papers = ref<Paper[]>([]);
const totalPapers = ref(0);
const currentPage = ref(1);
const papersPerPage = 10;


const fetchCitedPapers = async () => {
  try {
    const res = await getCitedPaperById(paperId);
    console.log(res)
    if (res) {
      papers.value = res.data;
    }
  } catch (error) {
    console.error("获取引用论文失败：", error);
  }
};

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchCitedPapers(); // 根据当前页重新获取论文数据
};

// 页面加载时获取引用的论文
onMounted(() => {
  fetchCitedPapers();
});
</script>

<template>
	<body>
	<div class="paper-list-page">
		<h2 style="text-align: center">引用论文列表</h2>
		<div class="paper-list">
			<PaperItem
				v-for="paper in papers"
				:key="paper.id"
				:paperVO="paper"
			/>
		</div>
		
		<!-- 分页 -->
		<el-pagination
			style="justify-content: center"
			:current-page="currentPage"
			:page-size="papersPerPage"
			:total="totalPapers"
			@current-change="handlePageChange"
			layout="prev, pager, next, jumper"
		/>
	</div>
	</body>

</template>

<style scoped>
body {
	background: linear-gradient(to bottom, #409eff, #ffffff);
}
</style>
