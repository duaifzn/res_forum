const resController = require('../controllers/resController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
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
  app.get('/', authenticate, (req, res) => { res.redirect('/restaurant') })
  app.get('/restaurant', authenticate, resController.getRes)
  app.get('/restaurant/:id', authenticate, resController.getARes)
  app.get('/admin', isAdmin, (req, res) => { res.redirect('/admin/restaurant') })
  app.get('/admin/restaurant', isAdmin, adminController.adminGetRes)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logOut)

  //新增餐廳頁面
  app.get('/admin/restaurant/create', isAdmin, adminController.createResPage)
  //新增一筆餐廳
  app.post('/admin/restaurant', isAdmin, upload.single('image'), adminController.createRes)
  //瀏覽一筆餐廳
  app.get('/admin/restaurant/:id', isAdmin, adminController.getRes)
  //刪除一筆餐廳
  app.delete('/admin/restaurant/:id', isAdmin, adminController.deleteRes)
  //修改餐廳頁面
  app.get('/admin/restaurant/:id/edit', isAdmin, adminController.editResPage)
  //修改一筆餐廳
  app.put('/admin/restaurant/:id/edit', isAdmin, upload.single('image'), adminController.editRes)

  //使用者頁面
  app.get('/admin/user', isAdmin, adminController.getUser)
  //修改使用者權限
  app.put('/admin/user/:id', isAdmin, adminController.putUser)

  //所有餐廳類別頁面
  app.get('/admin/category', isAdmin, adminController.getAllCategory)
  //新增餐廳類別
  app.post('/admin/category/create', isAdmin, adminController.createCategory)
  //修改餐廳類別頁面
  app.get('/admin/category/:id/edit', isAdmin, adminController.editCategoryPage)
  //修改餐廳類別
  app.put('/admin/category/:id/edit', isAdmin, adminController.editCategory)
  //刪除餐廳類別
  app.delete('/admin/category/:id/delete', isAdmin, adminController.deleteCategory)

  //新增評論
  app.post('/comment', authenticate, commentController.createComment)
  //刪除評論
  app.delete('/comment/:id', isAdmin, commentController.deleteComment)

  //fb登入
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/signin' }), userController.signIn);
  //google登入
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin' }), userController.signIn);
}
