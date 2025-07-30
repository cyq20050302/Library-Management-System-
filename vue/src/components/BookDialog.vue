<template>
  <el-dialog :title="isEdit ? '编辑图书' : '新增图书'" v-model="visible" width="400px" @close="onClose">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="书名" prop="title">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" autocomplete="off" />
      </el-form-item>
      <el-form-item label="出版日期" prop="publish_date">
        <el-date-picker v-model="form.publish_date" type="date" placeholder="选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option label="在馆" value="在馆" />
          <el-option label="借出" value="借出" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  formData: Object
});
const emits = defineEmits(['update:modelValue', 'submit']);

const formRef = ref(null);
const form = ref({
  title: '',
  author: '',
  publish_date: '',
  status: '在馆'
});
const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  publish_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});
watch(visible, (val) => {
  emits('update:modelValue', val);
});
watch(() => props.formData, (val) => {
  if (val) Object.assign(form.value, val);
  else Object.assign(form.value, { title: '', author: '', publish_date: '', status: '在馆' });
}, { immediate: true });

const onClose = () => visible.value = false;
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emits('submit', { ...form.value });
      onClose();
    }
  });
};
</script> 