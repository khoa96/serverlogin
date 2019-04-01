var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const UserLogin = require('../models/UserLogin.js');
const secret = require('../config.js');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// route lay toan bo cac users
router.get('/api/users', function (req, res, next) {
  const token = req.headers['x-api-key'];
  if (token) {
    jwt.verify(token, secret.secret, function (err, result) {
      if (err) {
        res.json({
          success: false,
          message: 'faile authencation token'
        })
      } else {
        UserLogin.find({}, function (err, users) {
          if (err) {
            res.status(400).json(err)
          } else {
            res.json(users)
          }
        })
      }
    })
  } else {
    res.json({
      success: false,
      message: 'token not provider'

    })
  }
})

//router get user theo id.
router.get('/api/users/:id', function (req, res, next) {
  const use_id = req.params.id;
  UserLogin.findById(use_id, function (err, user) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(user)
    }
  })
})

// router delete theo id.
router.delete('/api/users/:id', function (req, res, next) {
  const user_id = req.params.id;
  UserLogin.findByIdAndDelete(user_id, function (err, user) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(user)
    }
  })
})

// router update 1 ban ghi theo id.
router.put('/api/users/:id', function (req, res, next) {
  const user_id = req.params.id;
  const user = req.body;
  UserLogin.findByIdAndUpdate(user_id, user, { upsert: true }, function (err, user) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(user)
    }
  })
})

// router login kiem tra email va password ==> neu dang nhap thanh cong ==> update thong tin token cua user ==> tra ve token cho client
router.post('/api/authencation', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  UserLogin.findOne({ email: email, password: password }, function (err, user) {
    if (err) {
      res.status(400).json(err)
    } else {
      if (!user) {
        res.json({
          success: false,
          message: 'user not found, authencation false'
        })
      } else {
        const token = jwt.sign({
          id: user._id,
          email: user.email,
          password: user.password
        }, secret.secret, {
            expiresIn: 1440 // token song trong 1 ngay.
          });
        res.json({
          success: true,
          message: 'authencation success',
          token: token
        })
      }
    }
  })
})

// api them 1 users vao db. ==> route nay se dc goi khi create dang ki tai khoan
router.post("/api/users", function(req, res, next) {
  const data = req.body;
  UserLogin.insertMany([data], function(err, user) { 
    if (err) {
      res.status(400).json({
        success: false,
        message: "insert user to server failse"
      })
    } else {
      res.json(user)
    }
  })
})
module.exports = router;
// token cho user ( nguuyenvanf@gmail.com , password = 1234)
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOWRiOTZiMDY5ZTA3MDgwOWY2MjY4MCIsImVtYWlsIjoibmd1eWVudmFuZkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQiLCJpYXQiOjE1NTM4NTAyNjAsImV4cCI6MTU1Mzg1MTcwMH0.DnXeAn80YxdW8DSh4du9kY91R7l4idGFjWvpX9QjlSM