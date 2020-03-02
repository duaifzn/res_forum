const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService')

const adminController = {
  adminGetRes: (req, res) => {
    adminService.adminGetRes(req, res, (data) => {
      return res.render('admin/adminRes', data)
    })
  },
  createResPage: (req, res) => {
    Category.findAll().then(categories => {
      res.render('admin/createResPage', JSON.parse(JSON.stringify({ categories: categories })))
    })
  },
  createRes: (req, res) => {
    adminService.createRes(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.render('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/restaurant')
    })

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
    adminService.editRes(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/restaurant')
    })

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
  },

  getAllCategory: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/getAllCategory', JSON.parse(JSON.stringify({ categories: categories })))
    })
  },
  createCategory: (req, res) => {
    adminService.createCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash("error_messages", data['message'])
        return res.redirect('back')
      }
      req.flash("success_messages", data['message'])
      return res.redirect('back')
    })

  },
  editCategoryPage: (req, res) => {
    Category.findAll().then(categories => {
      Category.findByPk(req.params.id)
        .then(category => {
          return res.render('admin/getAllCategory', JSON.parse(JSON.stringify({ categories: categories, category: category })))
        })
    })


  },
  editCategory: (req, res) => {
    adminService.editCategory(req, res, (data) => {
      req.flash("success_messages", data['message'])
      return res.redirect("/admin/category")
    })
  },

  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('back')
    })
  }

}

module.exports = adminController