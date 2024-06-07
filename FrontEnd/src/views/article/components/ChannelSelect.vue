<script setup>
import { ref } from 'vue'
import { artGetChannlesService } from '@/api/article'

// 接收来自父组件的值
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannlesService()
  channelList.value = res.data.data
}
getChannelList()
</script>
<template>
  <!-- 拆解v-model变成modelValue和update:modelValue -->
  <el-select
    :style="{ width }"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
