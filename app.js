//include module
const express = require("express")
const exphbs = require("express-handlebars")
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')
const methodOverride = require('method-override')
require('dotenv').config()

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.static('public'))
//passport 放置session之後，及req.user使用之前
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')

  //console.log(req.user)
  next()
})

require('./routes')(app, passport)

//start and listen server
app.listen(port, () => {
  console.log(`http://localhost:${port} is running`)
})