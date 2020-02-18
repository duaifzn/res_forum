const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  adminGetRes: (req, res) => {
    Restaurant.findAll({ include: [Category] }).then(restaurants => {
      return res.render('admin/adminRes', JSON.parse(JSON.stringify({ restaurants: restaurants })))
    })
  },
  createResPage: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/createResPage', JSON.parse(JSON.stringify({ categories: categories })))
    })

  },
  createRes: (req, res) => {
    //console.log(req.body)
    if (!req.body.name) {
      req.flash('error_messages', '沒有輸入餐廳名稱')
      return res.redirect('admin/createResPage')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.selectCategory
        }).then(restaurant => {
          req.flash('success_messages', '新增成功!')
          return res.redirect('/admin/restaurant')
        })
      })


    }
    else {
      Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: file ? img.data.link : null,
        CategoryId: req.body.selectCategory
      }).then(restaurant => {
        req.flash('success_messages', '新增成功!')
        return res.redirect('/admin/restaurant')
      })
    }



  },
  getRes: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Category] })
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
    Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        Category.findAll().then(categories => {
          return res.render('admin/editResPage', JSON.parse(JSON.stringify({ restaurant: restaurant, categories: categories })))
        })
      })
  },
  editRes: (req, res) => {
    const { file } = req
    console.log(file)
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : null,
              CategoryId: req.body.selectCategory
            }).then(restaurant => {
              req.flash('success_messages', '修改成功!')
              return res.redirect('/admin/restaurant')
            })
          })
      })
    }
    else {
      Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            CategoryId: req.body.selectCategory
          }).then(restaurant => {
            req.flash('success_messages', '修改成功!')
            return res.redirect('/admin/restaurant')
          })
        })
    }
  },
  getUser: (req, res) => {
    User.findAll().then(users => {
      return res.render('admin/getUserPage', JSON.parse(JSON.stringify({ users: users })))
    })
  },
  putUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      user.update({
        isAdmin: !user.isAdmin
      }).then(user => {
        req.flash('success_messages', '權限變更成功')
        return res.redirect('/admin/user')
      })
    })
  }

}

module.exports = adminController