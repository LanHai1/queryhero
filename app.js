const express = require("express")

const path = require("path")

// 配置模块
const config = require(path.join(__dirname, "config.js"))

const app = express()

// 路由模块导入
const userRouter = require(path.join(__dirname, "./router/userRouter.js"))
const heroRouter = require(path.join(__dirname, "./router/heroRouter.js"))

const bodyParser = require("body-parser")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// 静态资源
app.use(express.static("public"))

// 文件资源暴露
app.use(express.static("download"))

// 路由绑定
app.use('/user', userRouter)
app.use('/hero', heroRouter)

app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}/login.html`)
})