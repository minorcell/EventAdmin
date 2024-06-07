import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken(登录) removeToken(退出)
export const useUserStore = defineStore(
  // 第一个参数 唯一标识
  'big-user',
  // 第二个参数 router配置函数
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      // 如果传入新token 就更新
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() //请求获取数据 并把数据存到pinia
      user.value = res.data.data
    }
    const setUser = (obj) => (user.value = obj)
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
  },
  {
    // 第三个参数 本地持久化配置
    persist: true
  }
)
