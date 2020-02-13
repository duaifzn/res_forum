const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

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
  }

}

module.exports = userController