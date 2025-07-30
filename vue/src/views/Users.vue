<template>
  <div class="users-root">
    <h1 class="users-title">用户管理</h1>
    <el-button type="primary" @click="openAddDialog" style="margin-bottom: 16px;">新增用户</el-button>
    <el-table :data="users" style="width: 100%; border-radius: 12px;">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="400px">
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const form = ref({ username: '', role: 'user' });
const formRef = ref(null);

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:3000/users');
  users.value = res.data;
};

const openAddDialog = () => {
  isEdit.value = false;
  form.value = { username: '', role: 'user' };
  dialogVisible.value = true;
};

const openEditDialog = (user) => {
  isEdit.value = true;
  currentId.value = user.id;
  form.value = { username: user.username, role: user.role };
  dialogVisible.value = true;
};

const onSubmit = async () => {
  if (isEdit.value) {
    await axios.put(`http://localhost:3000/users/${currentId.value}`, form.value);
  } else {
    await axios.post('http://localhost:3000/users', form.value);
  }
  dialogVisible.value = false;
  fetchUsers();
};

const deleteUser = async (id) => {
  await axios.delete(`http://localhost:3000/users/${id}`);
  fetchUsers();
};

onMounted(fetchUsers);
</script>

<style scoped>
.users-root {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}
.users-title {
  color: #7a9eb1;
  margin-bottom: 24px;
  margin-top: 0;
}
</style> 