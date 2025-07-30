<template>
  <div class="login-root">
    <el-card class="login-card">
      <h2 class="login-title">图书管理系统登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="60px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: right; margin-top: 8px;">
        <el-button type="text" @click="goRegister">没有账号？注册</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter();
const form = ref({ username: '', password: '' });
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const formRef = ref(null);
const onLogin = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await axios.post('http://localhost:3000/login', {
          username: form.value.username,
          password: form.value.password
        });
        // 登录成功，跳转到首页
        ElMessage.success('登录成功');
        router.push('/dashboard');
      } catch (e) {
        ElMessage.error(e.response?.data?.error || '登录失败');
      }
    }
  });
};
const goRegister = () => {
  router.push('/register');
};

onMounted(() => {
  // ...初始化图表
  setTimeout(() => {
    pieChart && pieChart.resize();
    barChart && barChart.resize();
    lineChart && lineChart.resize();
  }, 100);
});

onActivated(() => {
  pieChart && pieChart.resize();
  barChart && barChart.resize();
  lineChart && lineChart.resize();
});
</script>

<style scoped>
.login-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f6f2;
}
.login-card {
  width: 350px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(163,193,218,0.15);
  background: #f0e6ef;
}
.login-title {
  text-align: center;
  color: #7a9eb1;
  margin-bottom: 24px;
}
</style> 