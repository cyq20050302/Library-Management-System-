<template>
  <div class="borrow-root">
    <h1 class="borrow-title">借阅管理</h1>
    <el-table :data="records" style="width: 100%; border-radius: 12px;">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="book_title" label="书名" />
      <el-table-column prop="username" label="借阅人" />
      <el-table-column prop="borrow_date" label="借出日期" />
      <el-table-column prop="return_date" label="归还日期" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" v-if="scope.row.status==='借出'" @click="returnBook(scope.row.id)">还书</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="借书" width="400px">
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="书名" prop="book_id">
          <el-select v-model="form.book_id" placeholder="请选择">
            <el-option v-for="book in books" :key="book.id" :label="book.title" :value="book.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="借阅人" prop="user_id">
          <el-select v-model="form.user_id" placeholder="请选择">
            <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
    <el-button type="primary" @click="openDialog" style="margin-top: 16px;">借书</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const records = ref([]);
const books = ref([]);
const users = ref([]);
const dialogVisible = ref(false);
const form = ref({ book_id: '', user_id: '' });
const formRef = ref(null);

const fetchRecords = async () => {
  const res = await axios.get('http://localhost:3000/borrow');
  records.value = res.data;
};
const fetchBooks = async () => {
  const res = await axios.get('http://localhost:3000/books');
  books.value = res.data;
};
const fetchUsers = async () => {
  const res = await axios.get('http://localhost:3000/users');
  users.value = res.data;
};

const openDialog = () => {
  form.value = { book_id: '', user_id: '' };
  dialogVisible.value = true;
};

const onSubmit = async () => {
  await axios.post('http://localhost:3000/borrow', form.value);
  dialogVisible.value = false;
  fetchRecords();
};

const returnBook = async (id) => {
  await axios.put(`http://localhost:3000/borrow/${id}/return`);
  fetchRecords();
};

onMounted(() => {
  fetchRecords();
  fetchBooks();
  fetchUsers();
});
</script>

<style scoped>
.borrow-root {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}
.borrow-title {
  color: #7a9eb1;
  margin-bottom: 24px;
  margin-top: 0;
}
</style> 