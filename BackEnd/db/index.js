// 导入mysql模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '192417',
    database: 'api_server'
})

// 导出数据库连接对象
module.exports = db