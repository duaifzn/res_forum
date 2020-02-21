const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Like = db.Like


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      where: { email: profile._json.email }, defaults: {
        name: profile._json.name,
        email: profile._json.email,
        password: '12345678',
        isAdmin: false
      }
    }).then(user => {
      return cb(null, user[0])
    })
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['name', 'email']
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      where: { email: profile._json.email }, defaults: {
        name: `${profile._json.last_name} ${profile._json.first_name}`,
        email: profile._json.email,
        password: '12345678',
        isAdmin: false
      }
    }).then(user => {
      return cb(null, user[0])
    })
  }
));

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
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikeRestaurants' }
    ]
  }).then(user => {
    return done(null, user.get())
  });
});

module.exports = passport