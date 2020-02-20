const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const bcrypt = require('bcryptjs')
var imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.password != req.body.password2) {
      req.flash('error_messages', '密碼輸入不相同')
      return res.redirect('/signup')
    }

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          req.flash('error_messages', '帳號已註冊')
          return res.redirect('/signup')
        }
        else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
          }).then(user => {
            req.flash('success_messages', '成功註冊')
            return res.redirect('/signin')
          })
        }
      })

  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功')
    if (req.user.isAdmin) { return res.redirect('/admin/user') }
    else { return res.redirect('/restaurant') }
  },
  logOut: (req, res) => {
    req.logout()
    return res.redirect('/signin')
  },
  userPage: (req, res) => {
    User.findByPk(req.user.id, { include: [Comment, { model: Comment, include: [Restaurant] }] })
      .then(user => {
        //console.log(user)
        let commentNumber = user.Comments.length
        return res.render('userPage', JSON.parse(JSON.stringify({ user: user, commentNumber: commentNumber })))
      })
  },
  editUserPage: (req, res) => {
    User.findByPk(req.user.id)
      .then(user => {
        return res.render('user', JSON.parse(JSON.stringify({ user: user })))
      })
  },
  editUser: (req, res) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, avatar) => {
        User.findByPk(req.user.id)
          .then(user => {
            user.update({
              name: req.body.name,
              avatar: avatar.data.link
            }).then(user => {
              return res.redirect(`/user/${user.id}`)
            })
          })
      })
    }
    else {
      User.findByPk(req.user.id)
        .then(user => {
          user.update({
            name: req.body.name,
            avatar: 'https://via.placeholder.com/200'
          }).then(user => {

            return res.redirect(`/user/${user.id}`)
          })
        })
    }


  }

}

module.exports = userController