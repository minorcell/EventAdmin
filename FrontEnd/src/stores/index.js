// 以防复杂是pinia不好维护，将pinia相关从mian.js提取独立维护
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

// 导出并导入至main.js
export default pinia

/* // 导入modules的文件 方便路径书写
import { useUserStore } from './modules/user'
export { useUserStore } */

// 更简洁的写法：接受uesr模块的所有按需导入
export * from './modules/user'
