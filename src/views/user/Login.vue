<script setup lang="ts">
import { ElForm, ElFormItem } from "element-plus";
import { ref, computed } from 'vue';
import { router } from '../../router';
import { userLogin } from "../../api/user.ts";
import CryptoJS from "crypto-js";

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

const SALT = "SALT_STRING"
function hashPassword(password: string) {
	return CryptoJS.PBKDF2(password, SALT).toString(CryptoJS.enc.Hex);
}

// 登录按钮触发
function handleLogin() {
	const hashedPassword = hashPassword(password.value);
	console.log("Login: ", hashedPassword)
	
    userLogin({
        email: email.value,
        password: hashedPassword,
    }).then(res => {
	    if (res.status === 200) {
	        ElMessage({
	            message: "登录成功！",
	            type: 'success',
	            center: true,
	        });

	        sessionStorage.setItem('name', res.data.result.nickname);
	        sessionStorage.setItem('role', res.data.result.role);
	        sessionStorage.setItem('token', res.data.result.token);
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
  background-image: url("../../assets/background.jpg");
}
.title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1c3c6d;
  margin-bottom: 20px;
}
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9)); /* 渐变背景 */
  border-radius: 12px;
  color: #2d4c7c;
  box-shadow: 0 4px 12px rgba(5, 2, 2, 40);
}

.title {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #425b6c; /* 更深的字体颜色 */
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

/* 按钮颜色 */
.login-button {
  background-color: #5482b3;
  border-color: #235180;
  color: white;
}

.register-button {
  background-color: #ffffff;
  border-color: #dcdfe6;
  color: #526c88;
}

</style>
