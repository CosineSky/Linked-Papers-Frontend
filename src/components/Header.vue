<script setup lang="ts">
import { computed, ref } from "vue";
import { ElButton, ElDialog, ElTag, ElMessage, ElMessageBox } from 'element-plus';
import { userUpdate } from "../api/user.ts";
import { router } from '../router';
import { SwitchButton } from "@element-plus/icons-vue"; // 图标

// 控制弹窗显示与隐藏的状态
const dialogVisible = ref(false);

// 用户信息
const url = ref("src/assets/u.png");
const role = ref<string | null>(sessionStorage.getItem('role'));
const token = sessionStorage.getItem('token') as string;
const name = sessionStorage.getItem('name') as string;

// 角色文本计算
const roleText = computed(() => {
  return role.value === "VIP" ? "VIP" : "点击升级";
});

// 登录状态计算
const isLoggedIn = computed(() => role.value !== null && token !== null);

// 点击事件处理，根据角色决定是否显示弹窗
const handleClick = () => {
  if (role.value === "USER") {
    dialogVisible.value = true;
  } else {
    ElMessage.success("您已是尊贵的 VIP 用户！");
  }
};

// 退出登录
function logout() {
  ElMessageBox.confirm(
      '是否要退出登录？',
      '提示',
      {
        customClass: "customDialog",
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: "warning",
        showClose: false,
        roundButton: true,
        center: true
      }
  ).then(() => {
    sessionStorage.clear();
    router.push({ path: "/login" });
  });
}

// 更新用户信息，升到VIP
function updateInfo() {
  userUpdate({ token }).then(res => {
    if (res.status === 200) {
      ElMessage.success('您已是尊贵的VIP用户！');
      role.value = "VIP";
      sessionStorage.setItem('role', "VIP");
      dialogVisible.value = false;
      location.reload();
    }
  });
}
</script>
<template>
  <body>
  <el-header class="custom-header" height="20">
    <el-row :gutter="20">

      <el-col :span="4" class="header-icon">
        <router-link to="/search" class="no-link">
          <h1 class="header-text">Linked Papers</h1>
        </router-link>
      </el-col>

      <el-col :span="12"></el-col>

      <h3 class="hello-text">您好！{{ name }}</h3>

      <el-col :span="1" class="header-icon">
        <a @click="logout">
          <el-icon :size="35" color="white">
            <SwitchButton />
          </el-icon>
        </a>
      </el-col>

      <el-col :span="5">
        <template v-if="isLoggedIn">
          <!-- 已登录状态，显示角色tag和注销 -->
          <el-tag class="role-tag" size="large" @click="handleClick">{{ roleText }}</el-tag>
          <el-dialog
              v-model="dialogVisible"
              width="30%"
              class="dialog"
          >
            <el-image
                style="max-width:100%; height: auto; display: block; margin: 0 auto;"
                :src="url"
            ></el-image>
            <!-- 弹窗的底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false"
                class="cancel-button">取 消</el-button>
                <el-button type="primary"
                           class="pay-button"
                           @click="updateInfo">已支付</el-button>
              </span>
          </el-dialog>
        </template>

        <template v-else>
          <!-- 未登录状态，显示登录和注册链接 -->
          <router-link to="/login" class="link">Login</router-link>
          <router-link to="/register" class="link">Register</router-link>
        </template>
      </el-col>
    </el-row>
  </el-header>
  </body>
</template>
<style scoped>
body {
  height: 66px;
  background-color: #2a5caa;
}

.custom-header {
  background-color: #224b8f;
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
  color:#2a5caa;
  background: #dfe5ec;
}

.header-text {
  color: white;
  font-size: x-large;
  min-width: max-content;
  margin-top: 15px;
  margin-bottom: 15px;
}

.hello-text {
  color: white;
  margin-top: 20px;
  margin-bottom: 15px;
}

.header-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.link {
  margin: 0 10px;
  color: white;
  font-size: large;
  cursor: pointer;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
/* 按钮颜色 */
.pay-button {
  background-color: #5482b3;
  border-color: #235180;
  color: white;
}

.cancel-button {
  background-color: #ffffff;
  border-color: #dcdfe6;
  color: #526c88;
}

</style>

