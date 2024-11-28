<script setup lang="ts">
import {ElForm, ElFormItem} from "element-plus"
import {ref, computed} from 'vue'
import {router} from '../../router'
import {userInfo, userLogin} from "../../api/user.ts"

// 输入框值（需要在前端拦截不合法输入：是否为空+额外规则）
const email = ref('')
const password = ref('')

// 邮箱是否为空
const hasEmailInput = computed(() => email.value != '')
// 密码是否为空
const hasPasswordInput = computed(() => password.value != '')
// Email 格式验证正则
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = computed(() => emailRegex.test(email.value));

// 密码不设置特殊规则
// 登录按钮可用性
const loginDisabled = computed(() => {
  return !(hasEmailInput.value && email.value && hasPasswordInput.value)
})

// 登录按钮触发
function handleLogin() {
  userLogin({
    email: email.value,
    password: password.value
  }).then(res => {
    console.log(1)
       console.log(res)
    router.push({path: "/search"})
      if (res.status === 200) {
    // if (res.data.message === 'Login successful') {
      ElMessage({
        message: "登录成功！",
        type: 'success',
        center: true,
      })

      userInfo().then(res => {
        console.log(res)
        sessionStorage.setItem('name', res.data.result.name)
        sessionStorage.setItem('role',res.data.result.role)
        router.push({path: "/search"})
      })
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
      password.value = ''
    }
  })
}
</script>


<template>
  <el-main class="main-frame bgimage">
    <el-card class="login-card">
      <div>
        <h1>登入您的账户</h1>
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
                         type="primary">登入</el-button>
              <router-link to="/register" v-slot="{navigate}">
                <el-button @click="navigate">去注册</el-button>
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
}

.bgimage {
  background-image: url("../../assets/shopping-1s-1084px.svg");
}

.login-card {
  width: 60%;
  padding: 10px;
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
  gap: 30px;
  align-items: center;
  justify-content: right;
}
</style>
