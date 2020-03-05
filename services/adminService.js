const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  adminGetRes: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback(JSON.parse(JSON.stringify({ restaurants: restaurants })))
    })
  },
  getRes: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        callback({ restaurant: restaurant })
      })
  },
  createResPage: (req, res, callback) => {
    Category.findAll().then(categories => {
      callback({ categories: categories })
    })
  },
  getAllCategory: (req, res, callback) => {
    Category.findAll().then(categories => {
      callback({ categories: categories })
    })
  },
  deleteRes: (req, res, callback) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(() => {
            callback({ status: 'success', message: '' })
          })

      })
  },
  createRes: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: '沒有輸入餐廳名稱' })
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
          callback({ status: 'success', message: '新增成功!' })
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
        callback({ status: 'success', message: '新增成功!' })
      })
    }



  },
  editResPage: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        Category.findAll().then(categories => {
          callback({ status: 'success', message: { restaurant: restaurant, categories: categories } })
        })
      })
  },
  editRes: (req, res, callback) => {
    const { file } = req
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
              callback({ status: 'success', message: '修改成功!' })
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
            callback({ status: 'success', message: '修改成功!' })

          })
        })
    }
  },
  createCategory: (req, res, callback) => {
    if (!req.body.newCategory) {
      callback({ status: 'error', message: '沒有輸入類別' })
    }
    else {
      Category.create({
        name: req.body.newCategory
      }).then(() => {
        callback({ status: 'success', message: '新增成功' })

      })
    }
  },
  editCategory: (req, res, callback) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.update({
          name: req.body.editCategory
        }).then(() => {
          callback({ status: 'success', message: '修改成功' })
        })
      })


  },
  deleteCategory: (req, res, callback) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.destroy().then(() => {
          callback({ status: 'success', message: '刪除成功' })
        })

      })
  },
  getUser: (req, res, callback) => {
    User.findAll().then(users => {
      callback({ status: 'success', message: { users: users } })
    })
  },
  putUser: (req, res, callback) => {
    User.findByPk(req.params.id).then(user => {
      user.update({
        isAdmin: !user.isAdmin
      }).then(user => {
        callback({ status: 'success', message: '權限變更成功' })
      })
    })
  },
  getAllCategory: (req, res, callback) => {
    Category.findAll().then(categories => {
      callback({ status: 'success', message: { categories: categories } })
    })
  },
  editCategoryPage: (req, res, callback) => {
    Category.findAll().then(categories => {
      Category.findByPk(req.params.id)
        .then(category => {
          callback({ status: 'success', message: { categories: categories, category: category } })
        })
    })
  },
}

module.exports = adminService
