//include module
const express = require("express")
const exphbs = require("express-handlebars")
const app = express()
const port = 3000

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

require('./routes')(app)
//start and listen server
app.listen(port, () => {
  console.log(`http://localhost:${port} is running`)
})