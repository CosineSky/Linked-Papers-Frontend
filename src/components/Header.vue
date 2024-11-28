<script setup lang="ts">
import {computed} from "vue";
import UpgradeDialog from "./UpgradeDialog.vue"; // 导入封装的弹窗组件

const role = sessionStorage.getItem('role')
console.log(role)//登录的时候插入的

const roleText = computed(() => {
  return role == "VIP" ? "尊贵的 VIP 用户" : "点击升级";
});
const isLoggedIn = computed(() => {
  return role !== null;
});
// 点击事件处理，根据角色决定是否显示弹窗
const handleClick = () => {
  if (role == "USER") {
    //openDialog(); // 仅在用户为 USER 时显示升级弹窗
  } else {
    alert("您已是尊贵的 VIP 用户！");
  }
};
//退出登录

</script>


<template>

  <el-header class="custom-header" height="20">
    <el-row :gutter="20">

      <el-col :span="3" class="header-icon">
        <router-link to="/search" v-slot="{navigate}" class="no-link">
          <h1 @click="navigate" class="header-text">论文网站</h1>
        </router-link>
      </el-col>
      <el-col :span="14"></el-col>
      <el-col :span="2">
        <template v-if="isLoggedIn">
          <el-tag class="role-tag" size="large" @click="handleClick">{{ roleText }}</el-tag>
          <UpgradeDialog />
        </template>
        <template v-else>
          <router-link to="/login" class="link">Login</router-link>
          <router-link to="/register" class="link">Register</router-link>
        </template>
      </el-col>



    </el-row>
  </el-header>
</template>


<style scoped>
.custom-header {
  background-color: #409eff;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  display: flex;
  flex-direction: column;
}

.no-link {
  text-decoration: none;
}

.role-tag {
  margin-top: 20px;
  font-size: 20px;
}

.header-text {
  color:white;
  font-size: x-large;
  min-width: max-content;
  margin-top: 15px;
  margin-bottom: 15px;
}

.header-icon {
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
}

.link {
  margin: 0 10px;
  color: white;
  font-size: large;
  cursor: pointer;
}
</style>
