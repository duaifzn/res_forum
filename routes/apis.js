const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const adminController = require('../controllers/api/adminController')
const userController = require('../controllers/api/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// JWT signin
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/admin/restaurant', authenticated, authenticatedAdmin, adminController.adminGetRes)
router.get('/admin/restaurant/:id', adminController.getRes)
router.get('/admin/category', adminController.getAllCategory)
//新增一筆餐廳
router.post('/admin/restaurant', upload.single('image'), adminController.createRes)
//修改一筆餐廳
router.put('/admin/restaurant/:id/edit', upload.single('image'), adminController.editRes)
router.delete('/admin/restaurant/:id', adminController.deleteRes)
//新增餐廳類別
router.post('/admin/category/create', adminController.createCategory)
//修改餐廳類別
router.put('/admin/category/:id/edit', adminController.editCategory)
//刪除餐廳類別
router.delete('/admin/category/:id/delete', adminController.deleteCategory)

module.exports = router

