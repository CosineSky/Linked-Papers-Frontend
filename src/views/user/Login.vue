<script setup lang="ts">
import { ElForm, ElFormItem } from "element-plus";
import { ref, computed } from 'vue';
import { router } from '../../router';
import { userLogin } from "../../api/user.ts";

// 输入框值（需要在前端拦截不合法输入：是否为空+额外规则）
const email = ref('');
const password = ref('');

// 邮箱是否为空
const hasEmailInput = computed(() => email.value != '');
// 密码是否为空
const hasPasswordInput = computed(() => password.value != '');
// Email 格式验证正则
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = computed(() => emailRegex.test(email.value));

// 登录按钮可用性
const loginDisabled = computed(() => {
  return !(hasEmailInput.value && email.value && hasPasswordInput.value);
});

// 登录按钮触发
function handleLogin() {
  userLogin({
    email: email.value,
    password: password.value
  }).then(res => {
    if (res.status === 200) {
      ElMessage({
        message: "登录成功！",
        type: 'success',
        center: true,
      });
      sessionStorage.setItem('name', res.data.nickname);
      sessionStorage.setItem('role', res.data.role);
      sessionStorage.setItem('token', res.data.token);
      router.push({ path: "/search" });
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      });
      password.value = '';
    }
  });
}
</script>

<template>
  <el-main class="main-frame bgimage">
    <el-card class="login-card">
      <div>
        <h1 class="title">登入您的账户</h1>
        <el-form>
          <el-form-item>
            <label v-if="!hasEmailInput" for="email">邮箱</label>
            <label v-else-if="!isEmailValid" for="email" class="error-warn">邮箱不合法</label>
            <label v-else for="email">邮箱</label>
            <el-input id="email" type="text" v-model="email"
                      required :class="{'error-warn-input' :(hasEmailInput && !isEmailValid)}"
                      placeholder="请输入邮箱"/>
          </el-form-item>

          <el-form-item>
            <label for="password">账户密码</label>
            <el-input id="password" type="password" v-model="password"
                      required
                      placeholder="••••••••"/>
          </el-form-item>

          <span class="button-group">
              <el-button @click.prevent="handleLogin" :disabled="loginDisabled"
                         type="primary" class="login-button">登入</el-button>
              <router-link to="/register" v-slot="{navigate}">
                <el-button @click="navigate" class="register-button">去注册</el-button>
              </router-link>
          </span>
        </el-form>
      </div>
    </el-card>
  </el-main>
</template>

<style scoped>
.main-frame {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover; /* 自动调整背景图大小以覆盖 */
  background-position: center center; /* 居中显示背景图 */
  background-repeat: no-repeat; /* 防止重复显示背景图 */
}

.bgimage {
  background-image: url("../../assets/background.webp");
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9)); /* 渐变背景 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(5, 2, 2, 40);
}

.title {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #333; /* 更深的字体颜色 */
  margin-bottom: 20px;
}

.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}

.button-group {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: center; /* 居中按钮 */
}

.el-button {
  min-width: 120px;
  font-size: 16px; /* 更大字体的按钮 */
}

.el-button:hover {
  opacity: 0.9;
}

/* 输入框和按钮焦点样式 */
.el-input:focus, .el-button:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.4); /* 蓝色聚焦边框 */
}
/* 按钮颜色 */
.login-button {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
}

.register-button {
  background-color: #f4f4f4;
  border-color: #dcdfe6;
  color: #409eff;
}

</style>
