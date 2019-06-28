const express = require("express")

const router = express.Router()

const path = require("path")

// post 上传数据模块
const multer = require('multer')

// dest: 文件名 => 存放的文件夹
const upload = multer({ dest: 'download/' })

const db = require(path.join(__dirname, "../utils/db.js"))

// 所有英雄
router.get('/all', (req, res) => {
    db.connection.query(`SELECT heropluss.id, heropluss.name, heropluss.skill, heropluss.icon
FROM heropluss where isDelete = 0`, (err, data) => {
        if (err) {
            console.log(err)
            return res.json({
                code: 500,
                msg: "服务器错误"
            })
        }
        res.json({
            code: 200,
            msg: "数据获取成功",
            data
        })
    })
})

// 根据id获取英雄
router.get("/id", (req, res) => {
    const { id } = req.query
    db.connection.query(`SELECT heropluss.id, heropluss.name, heropluss.skill, heropluss.icon FROM heropluss WHERE id = ${id} and isDelete = 0;`, (err, data) => {
        if (err) {
            console.log(err)
            return res.json({
                code: 500,
                msg: "服务器错误"
            })
        }
        if (data.length) {
            return res.json({
                code: 200,
                msg: "数据获取成功",
                data
            })
        }
        res.json({
            code: 400,
            msg: "未找到此数据"
        })
    })
})

// 英雄新增
// upload.single(文件key名)
router.post("/add", upload.single('icon'), (req, res) => {
    const { name, skill } = req.body
    const file = req.file
    if (file == undefined) {
        return res.json({
            code: 400,
            msg: "头像不能为空"
        })
    }

    // 拼接完整路径 => 页面可以获取到的图片路径
    // const icon = `http://localhost:${config.port}/${req.file.filename}`
    const icon = req.file.filename

    if (name == "" || skill == "") {
        return res.json({
            code: 400,
            msg: "姓名或技能不能为空"
        })
    }
    db.connection.query(`INSERT INTO heropluss (heropluss.name, 
	heropluss.skill,heropluss.icon)VALUES ("${name}","${skill}","${icon}");`, (err, data) => {
        if (err) {
            console.log(err)
            return res.json({
                code: 500,
                msg: "服务器错误"
            })
        }
        res.json({
            code: 201,
            msg: "新增成功"
        })
    })
})

// 英雄删除
router.get("/delete", (req, res) => {
    const { id } = req.query
    db.connection.query(`UPDATE heropluss SET isDelete=1 WHERE id=${id};`, (err, data) => {
        if (err) {
            console.log(err)
            return res.json({
                code: 500,
                msg: "服务器错误"
            })
        }
        res.json({
            code: 204,
            msg: "删除成功"
        })
    })
})

// 英雄编辑
router.post("/update", upload.single('icon'), (req, res) => {
    let sql = ""
    const { id, name, skill } = req.body

    // 非空判断
    if (id == "" || name == "" || skill == "") {
        return res.json({
            code: 400,
            msg: "姓名或技能或id不能为空"
        })
    }

    sql = req.file == undefined ? `UPDATE heropluss SET name="${name}",skill="${skill}"
        WHERE id=${id} and isDelete=0;` : `UPDATE heropluss SET name="${name}",skill="${skill}",icon="${req.file.filename}"
        WHERE id=${id} and isDelete=0;`

    db.connection.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            return res.json({
                code: 500,
                msg: "服务器错误"
            })
        }
        res.json({
            code: 202,
            msg: "修改成功"
        })
    })
})

// 模糊查询
router.get("/search", (req, res) => {
    const { key } = req.query
    let sql = key == undefined ? `SELECT heropluss.id, heropluss.name, heropluss.skill, heropluss.icon
    FROM heropluss where isDelete = 0` : `SELECT heropluss.id,heropluss.name, heropluss.skill, heropluss.icon
    FROM heropluss WHERE name like "%${key}%" and isDelete = 0 or skill like "%${key}%" and isDelete = 0`
    db.connection.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            return res.json({
                code: 500,
                msg: "服务器错误"
            })
        }
        if (data.length) {
            return res.json({
                code: 200,
                msg: "数据获取成功",
                data
            })
        }
        res.json({
            code: 400,
            msg: "未找到此数据"
        })
    })
})

module.exports = router