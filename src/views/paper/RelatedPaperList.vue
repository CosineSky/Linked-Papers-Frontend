<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getRelatedPaperById } from "../../api/paper";
import PaperItem from "../../components/PaperItem.vue";
import {router} from '../../router'

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
      papers.value = res.data;
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
});
</script>

<template>
  <div class="paper-list-page">
    <h2>相关论文列表(VIP)</h2>
    <div class="paper-list">
      <PaperItem
          v-for="paper in papers"
          :key="paper.id"
          :paperVO="paper"
          @click="toPaperDetailPage(paper.id)"
      />
    </div>

  </div>
</template>
