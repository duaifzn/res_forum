const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
},
  function (req, email, password, done) {
    User.findOne({ where: { email: email } }).then(user => {
      if (!user) {
        //回傳無此帳號
        return done(null, false, req.flash('error_messages', '查無此帳號'))
      }
      //確認密碼
      if (!bcrypt.compareSync(password, user.password)) {
        //回傳密碼錯誤
        return done(null, false, req.flash('error_messages', '密碼輸入錯誤'))
      }

      return done(null, user)
    })

  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id).then(user => {
    return done(null, user.toJSON())
  });
});

module.exports = passport