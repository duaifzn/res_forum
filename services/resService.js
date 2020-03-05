const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant

const resService = {
  getRes: (req, res, callback) => {
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
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / 10)
      let totalPage = Array.from({ length: pages }, (value, index) => index + 1)
      let prev = page - 1 < 0 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      let data = result.rows.map(r => (
        {
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          //加入最愛判斷
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id)
        }
      ))

      Category.findAll().then(categories => {
        callback({ restaurants: data, categories: categories, categoryId: categoryId, totalPage: totalPage, prev: prev, next: next, page: page })
      })
    })
  },
}

module.exports = resService