//include module
const express = require("express")
const exphbs = require("express-handlebars")
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const port = 3000

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})
require('./routes')(app)
//start and listen server
app.listen(port, () => {
  console.log(`http://localhost:${port} is running`)
})