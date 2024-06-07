<script setup>
// 导入
import { ref } from 'vue'
import axios from 'axios'
import { Plus } from '@element-plus/icons-vue'
import ChannelSelect from './ChannelSelect.vue'
import {
  artPublishService,
  artEditService,
  artGetDetailService
} from '@/api/article'
// 单页面导入富文本编译器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// 变量声明
// 控制抽屉显示隐藏
const visiableDrawer = ref(false)
// 准备数据
const defaultForm = {
  title: '', //标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片 file 对象
  content: '', // 内容
  state: '' // 状态
}
const formModel = ref({ ...defaultForm })
const imgUrl = ref('')
const editorRef = ref()
const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 逻辑代码
// 防抖
const debounce = (fn, delay) => {
  let timeoutId = null
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
// 打开抽屉
const open = async (row) => {
  visiableDrawer.value = true
  if (row.id) {
    // 需要基于row.id发送请求，获取编辑对应的详情数据并回显。
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下
    formModel.value.cover_img = await imageUrlToFile(
      imgUrl.value,
      formModel.value.cover_img
    )
  } else {
    formModel.value = { ...defaultForm } //基于默认数据回显
    // 重置表单,但是图片上传和富文本编译器需要手动重置
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}
// 选择图片处理逻辑
const onUploadFile = (uploadFile) => {
  // URL.createObjectURL(uploadFile.raw) 前端创建地址的方法
  // 预览图片
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}
// 发布/提交
const emit = defineEmits(['success'])
const onPublish = debounce(async (state) => {
  // 将发布的状态存入formModel
  formModel.value.state = state
  /* 由于接口需要时formData对象，
    所以要把数据转换成formData对象
    1. 创建FormData实例
    2. 遍历传值： key 和 [key]
  */
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visiableDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    // 通知父组件添加成功
    emit('success', 'add')
  }
  visiableDrawer.value = false
}, 500)

// 对外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visiableDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="75%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
