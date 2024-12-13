<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCitedPaperById} from "../../api/paper";
import PaperItem from "../../components/PaperItem.vue";
import { ElPagination } from "element-plus";
import {router} from '../../router'
import {fullScreenLoading} from "../../utils/visuals";

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
const role = ref<string | null>(sessionStorage.getItem('role'))

// 点击论文卡片，跳转到对应的论文界面
function toPaperDetailPage(paperId: Number) {
  if(role.value === "USER"){
    alert("若要使用该功能，请您升级到VIP用户！");
  }else{
    router.push("/paperDetail/" + paperId)
  }
}

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
	fullScreenLoading(2500);
});
</script>
<template>
  <body>
  <div class="paper-list-page">
    <h2 class="page-title">引用论文列表</h2>
    <div class="paper-list">
      <PaperItem
          v-for="paper in papers"
          :key="paper.id"
          :paperVO="paper"
          @click="toPaperDetailPage(paper.id)"
      />
    </div>

    <!-- 分页 -->
    <el-pagination
        class="pagination"
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
/* 背景渐变色 */

.paper-list-page {
  background: linear-gradient(to bottom, #2a5caa, #fffef9);
  padding: 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.pagination {
  text-align: center;
  margin-top: 30px;
}
.paper-list::-webkit-scrollbar {
  width: 8px;
}

.paper-list::-webkit-scrollbar-thumb {
  background-color: #224b8f;
  border-radius: 10px;
}


.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #f4f4f4;
  font-size: 24px;
  font-weight: bold;
}

.paper-list {
  margin-top: 20px;
  max-height: 500px;
  overflow: auto;
  border-radius: 10px;
}


</style>
