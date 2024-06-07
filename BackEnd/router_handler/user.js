// 导入数据库模块
const db = require('../db/index')
// 导入密码加密包bcyptjs
const bcrypt = require('bcryptjs')
// 导入jsonwebtoken包，生成token字符串
const jwt = require('jsonwebtoken')
const config = require('../config')  // 导入配置文件

// 定义并导出用户注册处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交的用户名和密码
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        // return res.send({ status: 1, message: '用户名或密码不能为空' })
        return res.cc('用户名或密码不能为空')
    }
    // 查找是否已经存在
    const reName = 'select * from users where username=?'
    db.query(reName, userinfo.username, (err, results) => {
        // if (err) return res.send({ status: 1, message: err.message })
        if (results.length) return res.cc('用户名被占用，请更换其他用户名')
        if (results.length) return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' })
    })
    // 调用bcrypt.hashSync进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    // 插入数据
    const addUser = 'insert into users set ?'
    db.query(addUser, { username: userinfo.username, password: userinfo.password }, (err, results) => {
        // if (err) return res.send({ status: 1, message: err.message })
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后重试')
        // res.send({ status: 0, message: '注册成功' })
        res.cc('注册成功', 0)
    })
}
// 定义并导出用户登录处理函数
exports.login = (req, res) => {
    const userinfo = req.body
    const sql = `select * from users where username=?`
    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！')
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致
        /* 
            1. 判断用户输入的登录密码是否和数据库中的密码一致
            2. 如果一致则返回登录成功的提示
            3. 如果不一致则返回登录失败的提示
            注意：这个需要使用 bcrypt 提供的 compareSync 函数进行校验
            参数:   
                1. 用户输入的密码
                2. 数据库中的密码
        */
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('登录失败！')

        // TODO:在服务器端生成token
        /* 
            注意：
                password和user_pic不要返回给客户端
            这里可以通过es6中的展开运算符获取，然后把password和user_pic赋值为空
        */
        const user = { ...results[0], password: '', user_pic: '' }
        // 对用户的信息进行加密，生成token
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        })
        // 调用res.send()方法，将token返回给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr
        })
    })
}