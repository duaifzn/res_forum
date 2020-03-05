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
    adminService.createResPage(req, res, (data) => {
      return res.render('admin/createResPage', JSON.parse(JSON.stringify(data)))
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
    adminService.getRes(req, res, (data) => {
      return res.render(`admin/restaurant`, JSON.parse(JSON.stringify(data)))
    })
  },
  deleteRes: (req, res) => {
    adminService.deleteRes(req, res, (data) => {
      return res.redirect('back')
    })
  },
  editResPage: (req, res) => {
    adminService.editResPage(req, res, (data) => {
      return res.render('admin/editResPage', JSON.parse(JSON.stringify(data['message'])))
    })
  },
  editRes: (req, res) => {
    adminService.editRes(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/restaurant')
    })

  },
  getUser: (req, res) => {
    adminService.getUser(req, res, (data) => {
      return res.render('admin/getUserPage', JSON.parse(JSON.stringify(data['message'])))
    })
  },
  putUser: (req, res) => {
    adminService.putUser(req, res, (data) => {
      req.flash('success_messages', '權限變更成功')
      return res.redirect('back')
    })
  },

  getAllCategory: (req, res) => {
    adminService.getAllCategory(req, res, (data) => {
      return res.render('admin/getAllCategory', JSON.parse(JSON.stringify(data['message'])))
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
    adminService.editCategoryPage(req, res, (data) => {
      return res.render('admin/getAllCategory', JSON.parse(JSON.stringify(data['message'])))
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