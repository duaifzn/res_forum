const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const resController = require('../controllers/resController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/signin')
}
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
  }
  res.redirect('/signin')
}
router.get('/', authenticate, (req, res) => { res.redirect('/restaurant') })
router.get('/restaurant', authenticate, resController.getRes)

router.get('/restaurant/feeds', authenticate, resController.getFeeds)
//熱門餐廳頁面
router.get('/restaurant/top', authenticate, resController.popularRes)

router.get('/restaurant/:id', authenticate, resController.getARes)
//餐廳熱門度頁面
router.get('/restaurant/:id/popular', authenticate, resController.getResPopular)

router.get('/admin', isAdmin, (req, res) => { res.redirect('/admin/restaurant') })
router.get('/admin/restaurant', isAdmin, adminController.adminGetRes)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logOut)

//新增餐廳頁面
router.get('/admin/restaurant/create', isAdmin, adminController.createResPage)
//新增一筆餐廳
router.post('/admin/restaurant', isAdmin, upload.single('image'), adminController.createRes)
//瀏覽一筆餐廳
router.get('/admin/restaurant/:id', isAdmin, adminController.getRes)
//刪除一筆餐廳
router.delete('/admin/restaurant/:id', isAdmin, adminController.deleteRes)
//修改餐廳頁面
router.get('/admin/restaurant/:id/edit', isAdmin, adminController.editResPage)
//修改一筆餐廳
router.put('/admin/restaurant/:id/edit', isAdmin, upload.single('image'), adminController.editRes)

//使用者頁面
router.get('/admin/user', isAdmin, adminController.getUser)
//修改使用者權限
router.put('/admin/user/:id', isAdmin, adminController.putUser)

//所有餐廳類別頁面
router.get('/admin/category', isAdmin, adminController.getAllCategory)
//新增餐廳類別
router.post('/admin/category/create', isAdmin, adminController.createCategory)
//修改餐廳類別頁面
router.get('/admin/category/:id/edit', isAdmin, adminController.editCategoryPage)
//修改餐廳類別
router.put('/admin/category/:id/edit', isAdmin, adminController.editCategory)
//刪除餐廳類別
router.delete('/admin/category/:id/delete', isAdmin, adminController.deleteCategory)

//新增評論
router.post('/comment', authenticate, commentController.createComment)
//刪除評論
router.delete('/comment/:id', isAdmin, commentController.deleteComment)

//追隨人頁面
router.get('/user/top', authenticate, userController.getTopUser)
//追隨
router.post('/following/:userId', authenticate, userController.follow)
//取消追隨
router.delete('/following/:userId', authenticate, userController.cancelFollow)
//編輯個人資料
router.put('/user/:id/edit', authenticate, upload.single('avatar'), userController.editUser)
//個人資料頁面
router.get('/user/:id', authenticate, userController.userPage)
//編輯個人資料頁面
router.get('/user/:id/edit', authenticate, userController.editUserPage)


//加入最愛
router.post('/user/:id/favorite', authenticate, userController.addFavorite)
//刪除最愛
router.delete('/user/:id/favorite', authenticate, userController.deleteFavorite)


//按讚
router.post('/like/:restaurantId', authenticate, userController.like)
//取消讚
router.delete('/cancellike/:restaurantId', authenticate, userController.cancelLike)

//fb登入
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin' }), userController.signIn);
//google登入
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }), userController.signIn);

module.exports = router

