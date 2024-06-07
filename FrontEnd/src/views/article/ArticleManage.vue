<script setup>
// 导入区域
// 导入库依赖
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
// 导入组件
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
// 导入方法
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format.js'

// 定义数据区域

const articleList = ref([])
const total = ref(0)
const loading = ref(false)
// 定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const articleEditRef = ref()

// 逻辑处理区域

// 分页相关的逻辑
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
// 请求文章列表数据
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  loading.value = false
  articleList.value = res.data.data
  total.value = res.data.total
}
// 搜索和重置的逻辑
/* 按照最新的条件重新检索 */
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
/* 就是把筛选条件清空 */
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
// 添加逻辑
const onAddAeticle = () => {
  articleEditRef.value.open()
}
// 编辑逻辑
const onEditArticle = (row) => {
  // 把row传过去，根据传值判断，有row表示编辑
  articleEditRef.value.open(row)
}
// 删除逻辑
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}
// 添加或者编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}

// 调用方法
getArticleList()
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddAeticle">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline class="demo-form-inline">
      <el-form-item label="文章分类：">
        <!-- 复用较多，封装成组件 -->
        <channel-select v-model="params.cate_id" width="300px"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select style="width: 300px" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="articleList"
      style="width: 100%; margin-top: 20px; box-shadow: 0 0 10px #ddd"
    >
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <!-- 使之变成链接 -->
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            circle
            plain
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            type="danger"
            circle
            plain
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[5, 10, 50, 100]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>
<style lang="scss" scoped></style>
<!-- 
      因为插件自动将components组件引入，所以不用手动引入直接用
-->
