const express = require('express')
const router = express.Router()
const { regUser, login } = require('../router_handler/user')  // 导入路由处理函数 
const expressJoi = require('@escook/express-joi') // 导入 express-joi 中间件
const { reg_login_schema } = require('../schema/user') // 导入用户注册和登录的验证规则对象

// 注册新用户
/* 
    expressJoi(reg_login_schema) 中间件，用于验证表单数据
*/
router.post('/reguser', expressJoi(reg_login_schema), regUser)
// 登录
router.post('/login', expressJoi(reg_login_schema), login)

module.exports = router