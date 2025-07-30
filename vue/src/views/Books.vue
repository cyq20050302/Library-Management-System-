<template>
  <div class="books-root">
    <h1 class="books-title">图书管理</h1>
    <el-input v-model="search" placeholder="搜索书名/作者" style="width: 240px; margin-bottom: 16px;" @input="onSearch" clearable />
    <el-button type="primary" @click="openAddDialog" style="margin-left: 16px;">新增图书</el-button>
    <el-table :data="filteredBooks" style="width: 100%; border-radius: 12px; margin-top: 16px;">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="书名" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="publish_date" label="出版日期" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteBook(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <book-dialog
      v-model="dialogVisible"
      :isEdit="isEdit"
      :formData="currentBook"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import BookDialog from '../components/BookDialog.vue';
import { ElMessage } from 'element-plus';

const books = ref([]);
const search = ref('');
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentBook = ref(null);

const fetchBooks = async () => {
  const res = await axios.get('http://localhost:3000/books');
  books.value = res.data;
};

const filteredBooks = computed(() => {
  if (!search.value) return books.value;
  return books.value.filter(
    b => b.title.includes(search.value) || b.author.includes(search.value)
  );
});

const onSearch = () => {};

const openAddDialog = () => {
  isEdit.value = false;
  currentBook.value = null;
  dialogVisible.value = true;
};

const openEditDialog = (book) => {
  isEdit.value = true;
  currentBook.value = { ...book };
  dialogVisible.value = true;
};

const handleDialogSubmit = async (book) => {
  try {
    // 只取日期部分，避免MySQL日期格式错误
    if (book.publish_date) {
      if (typeof book.publish_date === 'string') {
        book.publish_date = book.publish_date.slice(0, 10);
      } else if (book.publish_date instanceof Date) {
        book.publish_date = book.publish_date.toISOString().slice(0, 10);
      }
    }
    if (isEdit.value) {
      await axios.put(`http://localhost:3000/books/${book.id}`, book);
      ElMessage.success('编辑成功');
    } else {
      await axios.post('http://localhost:3000/books', book);
      ElMessage.success('新增成功');
    }
    dialogVisible.value = false;
    fetchBooks();
  } catch (e) {
    ElMessage.error('操作失败');
  }
};

const deleteBook = async (id) => {
  await axios.delete(`http://localhost:3000/books/${id}`);
  fetchBooks();
};

onMounted(fetchBooks);
</script>

<style scoped>
.books-root {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}
.books-title {
  color: #7a9eb1;
  margin-bottom: 24px;
  margin-top: 0;
}
</style> 