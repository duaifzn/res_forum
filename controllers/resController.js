const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Like = db.Like
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
      //console.log('req.user.LikeRestaurants: ', req.user.LikeRestaurants)
      // let aaa = req.user.FavoritedRestaurants.map(d => d.id)
      // console.log('req.user.FavoritedRestaurants: ', aaa)
      var data = result.rows.map(r => (
        {
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          //加入最愛判斷
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id)
        }
      ))
      Category.findAll().then(categories => {
        return res.render('resList', JSON.parse(JSON.stringify({ restaurants: data, categories: categories, categoryId: categoryId, totalPage: totalPage, prev: prev, next: next, page: page })))
      })
    })
  },
  getARes: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikeUsers' }
      ]
    })
      .then(restaurant => {
        restaurant.update({
          //點擊次數加一
          clicks: restaurant.clicks + 1
        }).then(restaurant => {
          const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
          const isLike = restaurant.LikeUsers.map(d => d.id).includes(req.user.id)
          return res.render('guestRestaurant', JSON.parse(JSON.stringify({ restaurant: restaurant, isFavorited: isFavorited, isLike: isLike })))
        })

      })
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', JSON.parse(JSON.stringify({
          restaurants: restaurants,
          comments: comments
        })))
      })
    })
  },
  getResPopular: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Comment] }).then(restaurant => {
      const commentNumber = restaurant.Comments.length
      res.render('getResPopular', JSON.parse(JSON.stringify({ restaurant: restaurant, commentNumber: commentNumber })))
    })

  }
}

module.exports = resController