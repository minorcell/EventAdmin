<script setup>
import { artAddChannelsService, artEditChannelsService } from '@/api/article'
import { ref } from 'vue'
const dialogVisible = ref(false)
const formRef = ref()
// 组件对外暴露一个open方法
// 如果是空就是添加
//如果是有数据，就是渲染
const open = (row) => {
  dialogVisible.value = true
  // 将值传给formmodel
  formModel.value = { ...row }
  // 如果是编辑，需要将值赋给formmodel
  // 如果是添加，需要将值清空
}
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

const emit = defineEmits(['sucess'])
const onsubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelsService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelsService(formModel.value)
    ElMessage.success('新增成功')
  }
  setTimeout(() => {
    dialogVisible.value = false
  }, 1500)
  // 通知父组件刷新回显
  emit('sucess')
}
// 暴露给父组件，父组件可以调用
defineExpose({
  open
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑' : '新增'"
    width="500"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          placeholder="请输入分类名称"
          v-model="formModel.cate_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          placeholder="请输入分类别吗"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
