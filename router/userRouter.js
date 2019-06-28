const express = require("express")

const router = express.Router()

const path = require("path")

const db = require(path.join(__dirname, "../utils/db.js"))

// 登陆
router.get('/login', (req, res) => {
    res.send("/login")
})

let username, password

// 中间件 获取用户名和密码
router.use((req, res, next) => {
    username = req.body.username
    password = req.body.password
    next()
})

// 注册
router.post("/register", (req, res) => {
    // 不能为空
    if (username == undefined || password == undefined) {
        return res.json({
            code: 400,
            msg: "用户名或密码不能为空"
        })
    }
    // 查询数据库username是否重复
    // 注意 sql语句 条件值一定要加双引号
    db.connection.query(`select * from userpluss where username="${username}"`, function(err, data) {
        console.log(err)
        if (!err) {
            if (data.length) {
                // 已注册
                return res.json({
                    code: 400,
                    msg: "用户名已被注册"
                })
            }
        }
        // 插入数据
        db.connection.query(`INSERT INTO userpluss (username,password) VALUES ("${username}","${password}")`, function(err, data) {
            if (err) {
                console.log(err)
                return res.json({
                    code: 500,
                    msg: "服务器错误"
                })
            }
            res.json({
                code: 200,
                msg: "注册成功"
            })
        })
    })
})

// 登陆
router.post('/login', (req, res) => {
    // 不能为空
    if (username == undefined || password == undefined) {
        return res.json({
            code: 400,
            msg: "用户名或密码不能为空"
        })
    }
    db.connection.query(`SELECT userpluss.username, userpluss.password 
    FROM userpluss WHERE userpluss.username = "${username}" and userpluss.password = "${password}"`, (err, data) => {
        if (err) throw err
        if (data.length) {
            return res.json({
                code: 200,
                msg: "登陆成功"
            })
        }
        res.json({
            code: 400,
            msg: "用户名或密码错误"
        })
    })
})

module.exports = router