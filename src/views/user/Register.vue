<script setup lang="ts">
import {computed, ref} from 'vue';
import {router} from '../../router';
import {userRegister} from "../../api/user.ts";
import {ElMessage} from "element-plus";
import CryptoJS from 'crypto-js';

// 输入框值
const email = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');

// Email 格式验证正则
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = computed(() => emailRegex.test(email.value));

// 密码一致性校验
const isPasswordIdentical = computed(() => password.value === confirmPassword.value);

// 注册按钮可用性
const registerDisabled = computed(() => {
  return !(email.value && name.value && password.value && confirmPassword.value && isEmailValid.value && isPasswordIdentical.value);
});


// function hashWithSHA256(value: any) {
// 	return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
// }

const SALT = "SALT_STRING"
function hashPassword(password: string) {
	return CryptoJS.PBKDF2(password, SALT).toString(CryptoJS.enc.Hex);
}
// 注册按钮触发
function handleRegister() {
	const salt: string = crypto.randomUUID()
	const hashedPassword = hashPassword(password.value);
	console.log("Register: ", hashedPassword)
	
    userRegister({
	    salt: salt,
        name: name.value,
	    email: email.value,
        password: hashedPassword,
    }).then(res => {
        console.log(res)
        if (res.status === 200) {
            ElMessage({
                message: "注册成功！请登录账号",
                type: 'success',
                center: true,
            });
            router.push({ path: "/login" });
        }
		else if (res.data.code === '400') {
            ElMessage({
                message: res.data.msg,
                type: 'error',
                center: true,
            });
        }
    });
}
</script>

<template>
  <el-main class="main-frame bgimage">
    <el-card class="login-card">
      <div>
        <h1 class="title">创建一个新的账户</h1>

        <el-form class="form">
          <el-form-item>
            <label for="email">邮箱</label>
            <el-input id="email" v-model="email" placeholder="请输入邮箱"/>
            <span v-if="email && !isEmailValid" class="error-warn">邮箱格式不正确</span>
          </el-form-item>

          <el-form-item>
            <label for="name">昵称</label>
            <el-input id="name" v-model="name" placeholder="请输入昵称"/>
          </el-form-item>

          <el-form-item>
            <label for="password">密码</label>
            <el-input type="password" id="password" v-model="password" placeholder="••••••••"/>
          </el-form-item>

          <el-form-item>
            <label for="confirm-password">确认密码</label>
            <el-input type="password" id="confirm-password" v-model="confirmPassword" placeholder="••••••••"/>
            <span v-if="confirmPassword&& !isPasswordIdentical" class="error-warn">密码不一致</span>
          </el-form-item>

          <span class="button-group">
            <el-button @click.prevent="handleRegister" :disabled="registerDisabled" type="primary">
              创建账户
            </el-button>
            <router-link to="/login" v-slot="{ navigate }">
              <el-button @click="navigate"
              class="button">去登录</el-button>
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
  background-image: url("../../assets/background.jpg"); /* 替换为你的背景图路径 */
}

.login-card {
  width: 100%;
  max-width: 400px; /* 设置最大宽度，避免在小屏幕上过大 */
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.85); /* 半透明背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1c3c6d;
  margin-bottom: 20px;
}

.error-warn {
  color: red;
}

.form{
  color:#1c3c6d
}
.button{
  color:#1c3c6d;
}
.button-group {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: center; /* 居中按钮 */
}
</style>
