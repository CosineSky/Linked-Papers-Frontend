<script setup lang="ts">
import {computed, ref} from "vue";
import { ElButton, ElDialog } from 'element-plus';
import {userUpdate} from"../api/user.ts"
// 控制弹窗显示与隐藏的状态
const dialogVisible = ref(true);

const url = ref("src/assets/u.png")
const role = ref<string | null>(sessionStorage.getItem('role'))


const roleText = computed(() => {
  return role.value == "VIP" ? "尊贵的 VIP 用户" : "点击升级";
});
const isLoggedIn = computed(() => {
  return role.value != null;
});
// 点击事件处理，根据角色决定是否显示弹窗
const handleClick = () => {
  if (role.value == "USER") {
    dialogVisible.value = true;
  } else {
    alert("您已是尊贵的 VIP 用户！");
  }
};
//退出登录

function updateInfo() {
  const token = sessionStorage.getItem('token') as string;
  userUpdate({
    token:token
  }).then(res => {
    console.log(res)
    if (res.status === 200) {
      ElMessage({
        customClass: 'customMessage',
        type: 'success',
        message: '您已是尊贵的VIP用户！',
      })
      role.value = "VIP";
      dialogVisible.value = false;
    }
  })
}
</script>


<template>
	<body>
	<el-header class="custom-header" height="20">
		<el-row :gutter="20">
			
			<el-col :span="4" class="header-icon">
				<router-link to="/search" v-slot="{navigate}" class="no-link">
					<h1 @click="navigate" class="header-text">Linked Papers</h1>
				</router-link>
			</el-col>
			<el-col :span="17"></el-col>
			<el-col :span="2">
				<template v-if="isLoggedIn">
					<el-tag class="role-tag" size="large" @click="handleClick">{{ roleText }}</el-tag>
					<el-dialog
						title="升级到vip"
						v-model="dialogVisible"
						width="50%">
						<el-image
							style="width: 250px;height:350px"
							:src="url"
						></el-image>
						<!-- 弹窗的底部按钮 -->
						<span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateInfo">已支付</el-button>
            </span>
					</el-dialog>
				</template>
				<template v-else>
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
	background-color: #409eff;
}

.custom-header {
  background-color: #006bf8;
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
