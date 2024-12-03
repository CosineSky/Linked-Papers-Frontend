<script setup lang="ts">
import { ref, computed } from "vue";
import { searchByKeyword } from "../../api/paper";
import PaperItem from "../../components/PaperItem.vue";
import { ElButton, ElInput, ElPagination } from "element-plus";
import {router} from '../../router'
// 定义 Paper 接口
interface Paper {
  id: number;
  title: string;
}


const searchQuery = ref("");
const papers = ref<Paper[]>([]);
const totalPapers = ref(0);
const currentPage = ref(1);
const papersPerPage = 10;
const searchDisabled = computed(() => !searchQuery.value.trim());
const role = ref<string | null>(sessionStorage.getItem('role'))

const searchPapers = async () => {
  if (!searchQuery.value.trim()) {
    papers.value = [];
    totalPapers.value = 0;
    return;
  }
  if(role.value === null){
    alert("请先登录！");
  }else{
    try {
      // 发起 API 请求获取数据
      const res = await searchByKeyword(searchQuery.value, currentPage.value);
      if (res) {
        papers.value = res.data.essays;
        totalPapers.value = res.data.total_pages;
      }
    } catch (error) {
      console.error("搜索失败：", error);
    }
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  searchPapers(); // 根据当前页重新获取论文数据
}
// 点击论文卡片，跳转到对应的论文界面
function toPaperDetailPage(paperId: Number) {
  router.push("/paperDetail/" + paperId);
}
</script>
<template>
  <body>
  <div class="search-page">
    <div class="search-container">
      <el-input
          v-model="searchQuery"
          placeholder="请输入搜索关键词"
          clearable
          class="search-input"
      />
      <el-button :disabled="searchDisabled" type="primary" @click="searchPapers" class="search-button">搜索</el-button>
    </div>
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
        v-if="papers.length > 0"
        :current-page="currentPage"
        :page-size="papersPerPage"
        :total="totalPapers"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
        class="pagination"
    />
  </div>
  </body>
</template>

<style scoped>
.search-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 5px; /* 调整搜索框与列表之间的间距 */
}

.search-input {
  width: 400px; /* 加长搜索框 */
}

.search-button {
  padding: 10px 20px;
  border-radius: 6px;
  background-color: #224b8f;
  border: none;
  color: white;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #1c3c6d; /* 悬浮效果 */
}

.paper-list {
  margin-top: 20px;
  max-height: 500px;
  overflow: auto;
  width: 100%;
}

.pagination {
  margin-top: 30px; /* 控制分页与列表的间距 */
}

.paper-list::-webkit-scrollbar {
  width: 8px;
}

.paper-list::-webkit-scrollbar-thumb {
  background-color: #224b8f;
  border-radius: 10px;
}

body {
  background: linear-gradient(to bottom, #2a5caa, #fffef9);
}
</style>
