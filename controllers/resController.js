const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const resController = {
  getRes: (req, res) => {
    let wherequery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      wherequery['CategoryId'] = categoryId
    }
    let pageLimit = 10
    let offSet = 0
    if (req.query.page) {
      offSet = (Number(req.query.page) - 1) * pageLimit
    }

    Restaurant.findAndCountAll({ include: [Category], where: wherequery, offset: offSet, limit: pageLimit }).then(result => {
      //console.log(restaurants)
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / 10)
      let totalPage = Array.from({ length: pages }, (value, index) => index + 1)
      let prev = page - 1 < 0 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      //console.log('next:', next)
      var data = result.rows.map(r => (
        { ...r.dataValues, description: r.dataValues.description.substring(0, 50) }
      ))
      Category.findAll().then(categories => {
        return res.render('resList', JSON.parse(JSON.stringify({ restaurants: data, categories: categories, categoryId: categoryId, totalPage: totalPage, prev: prev, next: next, page: page })))
      })
    })
  },
  getARes: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] }).then(restaurant => {
      //console.log(restaurant)
      return res.render('guestRestaurant', JSON.parse(JSON.stringify({ restaurant: restaurant })))
    })
  }
}

module.exports = resController