const express = require('express');
const user = require('./server/user')
const mongoose = require("mongoose");
const path = require('path')
const fs = require('fs')
const bodyParser = require("body-parser")
const app = express()
var jwt = require('jsonwebtoken')

const cors = require("cors");
app.use(cors()); //就这一部就已经解决了跨域
//这一句是连接上数据库
var db = mongoose.connect('mongodb://localhost:27017/gameServe', { useNewUrlParser: true, useUnifiedTopology: true });





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//校验token是否正确
app.use(function (req, res, next) {
  //校验token过滤登录注册页
  console.log(req.url)
  if (req.url !== "/api/updata") {
    next()
  } else {
    //校验token
    jwt.verify(req.get("Set-Token"), "lyhq", function (err, decode) {
      if (err) {  //校验token失败    
        res.send({ code: 401, message: "请重新登录" });
      } else {
        next()
      }
    })
  }
})
app.use('/api', user)

// app.use(express.static(path.resolve(__dirname, './dist')))
// // 首页静态页面
// app.get('*', function(req, res) {
//   const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
//   res.send(html)
// })


app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});
// 监听80端口
app.listen(4000);
console.log('server is running 4000');


