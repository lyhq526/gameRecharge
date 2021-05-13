// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
var { User, List } = require('../module/user')
var dbPage = require('./dbPage');
var jwt = require('jsonwebtoken')
router.post('/user/register', (req, res) => {
  User.find({ userName: req.body.userName }, (err, data) => {
    if (err) {
      console.log('查询失败')
      res.send({ code: 500, message: '该用户名已经注册！' });
    } else {
      if (data.length > 0) {
        res.send({ code: 500, message: '该用户名已经注册！' });
        return
      } else {
        let newName = new User({
          userName: req.body.userName,
          passWord: req.body.passWord
        });
        newName.save((err, data) => {
          if (err) {
            res.send({ code: 400, message: '注册失败！', data: err });
          } else {
            res.send({ code: 200, message: '注册成功!' });
          }
        });
      }
    }
  })
})
const auth = async (req, res, next) => {
  let { id } = jwt.verify(req.get("Set-Token"), "lyhq")
  req.userId = id
  next()
}
// 登录接口
router.post('/user/login', (req, res) => {
  User.find({ userName: req.body.userName }, (err, data) => {
    if (err) {
      res.send({ code: 500, message: '查询数据库失败!', data: err });
    } else {
      console.log('data: ', data);
      if (data.length > 0) {
        if (data[0].passWord === req.body.passWord) {
          let token = jwt.sign({ id: data[0]._id }, "lyhq", {
            expiresIn: 60 * 30 * 10  // 0.5小时过期
          });
          res.send({ code: 200, message: '登录成功!', data: { userInfo: data[0].userName, token } })
        } else {
          res.send({ code: 401, message: '密码错误!', data: err });
        }
      } else {
        res.send({ code: 401, message: '登录失败，该用户没有注册!', data: err });
      }
    }
  });
});

router.post('/list', async (req, res) => {
  console.log(323223232323)
  var page = req.body.page || 1;
  const phoneReg = new RegExp(req.body.phone, 'i') //不区分大小写
  const idReg = new RegExp(req.body.gameUserId, 'i')
  let pram = {}
  if(req.body.createTimeStart && req.body.createTimeEnd){
    pram.createTime = { "$gte": new Date(req.body.createTimeStart || ""), "$lte": new Date(req.body.createTimeEnd || "") }
  }
  if(req.body.phone){
    pram.phone = { $regex: phoneReg }
  }
  if(req.body.gameUserId){
    pram.gameUserId = { $regex: idReg }
  }
  if(req.body.game){
    pram.game = req.body.game
  }
  dbPage.pageQuery(page, 10, List, '', pram, {
    created_time: 'desc'
  }, function (error, $page) {
    if (error) {
      res.send({
        message:"查询错误"
      })
    } else {
      res.send({
        code:200,
        data: $page.results,
        pageCount: $page.pageCount
      })
    }
  });
  // List.find({}, (err, data) => {
  //   res.send({ code: 200, data, message: '操作成功' })
  // })

});
router.post('/addList', async (req, res) => {
  if(!req.body.phone || !req.body.game || !req.body.gameUserId || !req.body.Ingots){
    res.send({ code: 500, message: '保存失败！' });
    return
  }
  let cookieSava = new List({
    phone: req.body.phone,
    game: req.body.game,
    gameUserId: req.body.gameUserId,
    Ingots: req.body.Ingots
  });
  cookieSava.save((err, data) => {
    if (err) {
      res.send({ code: 400, message: '保存失败！', data: err });
    } else {
      res.send({ code: 200, message: '保存成功!' });
    }
  });
});
router.post('/user/deleteList', auth, async (req, res) => {
  Cookie.deleteOne({ userId: req.userId, _id: req.body.id }, (err, data) => {
    if (err) {
      res.send({ code: 500, message: '删除失败' })
    } else {
      res.send({ code: 200, message: '操作成功' })
    }
  })

});
// router.post('/select', auth, async (req, res) => {
//   Cookie.findOne({ userId: req.userId, _id: req.body.id }, (err, data) => {
//     if (err) {
//       res.send({ code: 500, message: '查询失败' })
//     } else {
//       if (data.type == 2) {
//         res.send({
//           code: 200, message: '操作成功', data: {
//             SessionKey: data.panCookie.header.SessionKey,
//             Signature: data.panCookie.header.Signature,
//             Date: data.panCookie.header.Date,
//             Cookie: data.panCookie.COOKIE_LOGIN_USER,
//             ftqq: data.ftqq,
//             desc: data.desc
//           }
//         })
//       } else {
//         res.send({
//           code: 200, message: '操作成功', data: {
//             Cookie: data.videoCookie.Cookie,
//             loginUrl: data.videoCookie.loginUrl,
//             ftqq: data.ftqq,
//             desc: data.desc
//           }
//         })
//       }

//     }
//   })
// });

router.post('/updata', async (req, res) => {
  let pram = {
    status: req.body.status,
  }
  if(pram.status=="-1"){
    pram.errorText = req.body.errorText
  }
  List.updateOne({ _id: req.body.id },pram, (err, data) => {
    console.log(data)
    if (err) {
      res.send({ code: 500, message: '编辑失败' })
    } else {
      res.send({ code: 200, message: '操作成功' })
    }
  })


});



module.exports = router;