const db = require('../models')
const Restaurant = db.Restaurant
const resController = {
  getRes: (req, res) => {
    Restaurant.findAll().then(restaurants => {
      return res.render('resList', JSON.parse(JSON.stringify({ restaurants: restaurants })))
    })
  }
}

module.exports = resController