const db = require('../models')
const Restaurant = db.Restaurant
const resController = {
  getRes: (req, res) => {
    Restaurant.findAll().then(restaurants => {
      return res.render('resList', JSON.parse(JSON.stringify({ restaurants: restaurants })))
    })
  },
  getARes: (req, res) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('guestRestaurant', JSON.parse(JSON.stringify({ restaurant: restaurant })))
    })
  }
}

module.exports = resController