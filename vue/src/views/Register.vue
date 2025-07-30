<template>
  <div class="register-root">
    <el-card class="register-card">
      <h2 class="register-title">注册新账号</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input v-model="form.confirm" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onRegister">注册</el-button>
          <el-button type="text" @click="goLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const router = useRouter();
const form = ref({ username: '', password: '', confirm: '' });
const formRef = ref(null);
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirm: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      }, trigger: 'blur' }
  ]
};
const onRegister = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await axios.post('http://localhost:3000/register', {
          username: form.value.username,
          password: form.value.password
        });
        router.push('/login');
      } catch (e) {
        // 可根据后端返回提示错误
      }
    }
  });
};
const goLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f6f2;
}
.register-card {
  width: 350px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(163,193,218,0.15);
  background: #f0e6ef;
}
.register-title {
  text-align: center;
  color: #7a9eb1;
  margin-bottom: 24px;
}
</style> 