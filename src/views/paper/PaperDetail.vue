<script setup lang="ts">
import { ref, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPaperById} from "../../api/paper";

interface Paper {
  title: string;
  abstract: string;
  category: string;
}

const route = useRoute();
const router = useRouter();
const id = ref(route.params.paperId as string);
const paperId =+ id.value;
const paper = ref<Paper | null>(null);
const role = ref<string | null>(sessionStorage.getItem('role'))

// 获取论文详情的函数
const fetchPaperDetail = async () => {
  try {
    console.log(id.value)
    const res = await getPaperById(paperId);
    if (res) {
      console.log(res);
      paper.value = res.data;
    }
  } catch (error) {
    console.error("获取论文详情失败：", error);
  }
};
console.log(role.value);
// 按钮点击跳转处理，根据角色进行鉴权
const navigateTo = (path: string) => {
  if (path === "relatedPaperList" || path === "citedPaperList") {
    if (role.value != "VIP") {
      alert("您需要 VIP 权限才能访问此内容");
      return;
    }else{
      router.push({ name: path, params: { paperId: paperId } });
    }
  }else{
    router.push({ name: path, params: { paperId: paperId } });
  }
};

// 页面加载时获取论文详情
onMounted(() => {
  fetchPaperDetail();
});
</script>
<template>
  <body>
  <div class="paper-detail-container">
    <h2>{{ paper?.title }}</h2>
    <p><strong>摘要：</strong> {{ paper?.abstract }}</p>
    <p><strong>类别：</strong> {{ paper?.category }}</p>
    <div class="bottom-buttons">
      <!-- 按钮部分 -->
      <el-button
          type="primary"
          @click="navigateTo('similarPaperList')"
          class="action-button"
      >
        查看同类论文
      </el-button>
      <el-button
          type="primary"
          @click="navigateTo('relatedPaperList')"
          class="action-button"
      >
        查看相似论文(VIP)
      </el-button>
      <el-button
          type="primary"
          @click="navigateTo('citedPaperList')"
          class="action-button"
      >
        查看引用论文(VIP)
      </el-button>
    </div>
  </div>
  </body>
</template>

<style scoped>
/* 背景渐变 */
body {
  background: linear-gradient(to bottom, #2a5caa, #fffef9);
}

.paper-detail-container {
  padding: 20px;
  max-width: 600px;
  margin: 50px auto 20px; /* 增大顶部间距，使卡片距离页面顶部更远 */
  background-color: rgba(245, 245, 245, 0.9); /* 90%透明度 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 轻微阴影效果 */
}

.paper-detail-container h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #224b8f; /* 设置标题颜色 */
}

.paper-detail-container p {
  margin: 10px 0;
  color: #4e72b8; /* 设置文本颜色 */

}

/* 按钮样式 */
.bottom-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 15px; /* 按钮之间的间距 */
}

.action-button {
  padding: 10px 20px;
  background-color: #224b8f; /* 按钮颜色 */
  color: white;
  border-radius: 6px;
  border: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
  background-color: #1c3c6d; /* 按钮悬浮时的颜色 */
  transform: translateY(-3px); /* 悬浮时的移动效果 */
}
</style>
