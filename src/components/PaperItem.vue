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
  background-color: rgba(255, 254, 249, 0.7); /* 背景色#fffef9，70%透明度 */
  transition: all 0.3s ease; /* 平滑过渡 */
}

.paper-item-card:hover {
  transform: translateY(-5px); /* 悬浮时向上移动 */
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.paper-item-main {
  margin: 20px;
  line-height: 30px;
  font-size: 16px;
  color: #224b8f; /* 设置文字颜色 */
}
</style>
