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
//onst role = sessionStorage.getItem("role")

const searchQuery = ref("");
const papers = ref<Paper[]>([]);
const totalPapers = ref(0);
const currentPage = ref(1);
const papersPerPage = 10;

const searchDisabled = computed(() => !searchQuery.value.trim());


const searchPapers = async () => {
  if (!searchQuery.value.trim()) {
    papers.value = [];
    totalPapers.value = 0;
    return;
  }

  try {
    // 发起 API 请求获取数据
    const res = await searchByKeyword(searchQuery.value, currentPage.value);
    console.log(res);
    if (res) {
      papers.value = res.data.essays;
      console.log(papers.value);
      totalPapers.value = res.data.totalCount;
    }
  } catch (error) {
    console.error("搜索失败：", error);
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  searchPapers(); // 根据当前页重新获取论文数据
}
// 点击论文卡片，跳转到对应的论文界面
function toStoreDetailPage(paperId: Number) {
  router.push("/paperDetail/" + paperId)
}
</script>

<template>
  <div class="search-page">
    <el-input
        v-model="searchQuery"
        placeholder="请输入搜索关键词"
        clearable
        style="width: 300px; margin-bottom: 20px;"
    />
    <el-button :disabled="searchDisabled" type="primary" @click="searchPapers">搜索</el-button>

    <div class="paper-list">
      <PaperItem
          v-for="paper in papers"
          :key="paper.id"
          :paperVO="paper"
          @click="toStoreDetailPage(paper.id)"
      />
    </div>

    <!-- 分页 -->
    <el-pagination
        :current-page="currentPage"
        :page-size="papersPerPage"
        :total="totalPapers"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
    />
  </div>
</template>

<style scoped>
.search-page {
  padding: 20px;
}

.paper-list {
  margin-top: 20px;
}

</style>
