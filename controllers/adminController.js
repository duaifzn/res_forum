const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  adminGetRes: (req, res) => {
    Restaurant.findAll().then(restaurants => {

      return res.render('admin/adminRes', JSON.parse(JSON.stringify({ restaurants: restaurants })))
    })
  },
  createResPage: (req, res) => {
    return res.render('admin/createResPage')
  },
  createRes: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '沒有輸入餐廳名稱')
      return res.redirect('admin/createResPage')
    }
    Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    }).then(restaurant => {
      req.flash('success_messages', '新增成功!')
      return res.redirect('/admin/restaurant')
    })
  },
  getRes: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        return res.render(`admin/restaurant`, JSON.parse(JSON.stringify({ restaurant: restaurant })))
      })
  },
  deleteRes: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            return res.redirect('/admin/restaurant')
          })

      })
  },
  editResPage: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        return res.render('admin/editResPage', JSON.parse(JSON.stringify({ restaurant: restaurant })))
      })
  },
  editRes: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        }).then(restaurant => {
          req.flash('success_messages', '修改成功!')
          return res.redirect('/admin/restaurant')
        })
      })

  }

}

module.exports = adminController