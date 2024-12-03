<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getRelatedPaperById } from "../../api/paper";
import PaperItem from "../../components/PaperItem.vue";
import {router} from '../../router'
import Graph from "../../components/Graph.vue";
import {fullScreenLoading} from "../../utils/visuals";

interface Paper {
  id: number;
  title: string;
}

const route = useRoute();
const id = ref(route.params.paperId as string);
const paperId =+id.value;
const papers = ref<Paper[]>([]);
const role = ref<string | null>(sessionStorage.getItem('role'))


const fetchRelatedPapers = async () => {
  try {
    const res = await getRelatedPaperById(paperId);
    if (res) {
      papers.value = res.data.essays;
    }
  } catch (error) {
    console.error("获取相关论文失败：", error);
  }
};
// 点击论文卡片，跳转到对应的论文界面
function toPaperDetailPage(paperId: Number) {
  if(role.value === "USER"){
    alert("若要使用该功能，请您升级到VIP用户！");
  }else{
    router.push("/paperDetail/" + paperId)
  }
}


onMounted(() => {
    fetchRelatedPapers();
	fullScreenLoading(3000);
});
</script>

<template>
	<body>
		<div class="main-container">
			<div class="paper-list-page">
        <h2 class="page-title">相关论文列表</h2>
				<div class="paper-list">
					<PaperItem
						v-for="paper in papers"
						:key="paper.id"
						:paperVO="paper"
						@click="toPaperDetailPage(paper.id)"
					/>
				</div>
			</div>

			<div id="app">
				<Graph :papers="papers" />
			</div>
		</div>
	</body>
</template>

<style scoped>
body {
	background: linear-gradient(to bottom, #2a5caa, #fffef9);
	overflow: hidden;
}
.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #fffef9;  /* 标题颜色 */
  font-size: 28px;
  font-weight: bold;
  text-transform: uppercase;  /* 标题大写 */
  letter-spacing: 1px;  /* 字符间距 */
}
.main-container {
	display: flex;
	flex-direction: row;
	max-height: 500px;
}
.paper-list {
	margin-top: 20px;
	max-height: 500px;
	overflow: auto;
}
/* 滑动条样式 */
.paper-list::-webkit-scrollbar {
  width: 8px;  /* 滑动条宽度 */
}
.paper-list::-webkit-scrollbar-thumb {
  background-color: #224b8f;
  border-radius: 10px;
}
#app {
  padding: 20px;
  background-color: #fffef9;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-left: 20px;  /* 页面元素间的间隙 */
  margin-right: 50px;
  margin-top:20px;
}
</style>

