<script setup>
import { ref } from 'vue'
import { artGetChannlesService, artDelChannelsService } from '../../api/article'

import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  // 发送请求前后loading效果设置
  loading.value = true
  const res = await artGetChannlesService()
  channelList.value = res.data.data
  loading.value = false
  console.log(channelList.value)
}
getChannelList()

const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onAddChannel = () => {
  dialog.value.open()
}
const onDelChannel = async (row) => {
  await ElMessageBox.confirm(`确认删除"${row.cate_name}"分类吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelsService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onSucess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table
      v-loading="loading"
      :data="channelList"
      style="width: 100%; box-shadow: 0 0 10px #ddd"
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row是channelList的每一项，相当于item, -->
        <template #default="{ row, $index }">
          <el-button
            @click="onEditChannel(row, $index)"
            type="primary"
            :icon="Edit"
            circle
            plain
          ></el-button>
          <el-button
            @click="onDelChannel(row, $index)"
            type="danger"
            :icon="Delete"
            circle
            plain
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <!-- 编辑或者删除 -->
    <ChannelEdit ref="dialog" @sucess="onSucess"></ChannelEdit>
  </page-container>
</template>
<style lang="scss" scoped></style>
<!-- 
    因为插件自动将components组件引入，所以不用手动引入直接用
 -->
