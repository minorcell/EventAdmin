// 本模块为基本服务器模块
const express = require('express') // 导入express模块
const cors = require('cors') // 导入跨域中间件cors
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userinfo')
const joi = require('joi') // 导入joi模块
const app = express() // 创建express应用
const expressJwt = require('express-jwt') // 导入express-jwt模块,用于解析客户端返回的Token
const config = require('./config') // 导入配置文件
const artCateRouter = require('./router/artcate')  // 导入并使用文章分类路由模块
const articleRouter = require('./router/article')  // 导入并使用文章分类路由模块

app.use(cors()) // 使用跨域中间件cors
app.use(express.urlencoded({ extended: false })) // 解析application/x-www-form-urlencoded格式的请求体

// 封装res.cc函数：抽离相同代码，自定义中间件，全局使用。
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
// 在路由之前配置解析Token的中间件
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

app.use('/api', userRouter) // 用户路由

app.use('/my', userInfoRouter) // 用户信息路由

app.use('/my/article', artCateRouter) // 文章分类路由

app.use('/my/article', articleRouter) // 文章列表路由

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获token验证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知的错误
    res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
    console.log('app is running at http://localhost:3007')
})