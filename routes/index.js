const resController = require('../controllers/resController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
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
  app.get('/admin/restaurant/create', authenticate, adminController.createResPage)
  //新增一筆餐廳
  app.post('/admin/restaurant', authenticate, upload.single('image'), adminController.createRes)
  //瀏覽一筆餐廳
  app.get('/admin/restaurant/:id', authenticate, adminController.getRes)
  //刪除一筆餐廳
  app.delete('/admin/restaurant/:id', authenticate, adminController.deleteRes)
  //修改餐廳頁面
  app.get('/admin/restaurant/:id/edit', authenticate, adminController.editResPage)
  //修改一筆餐廳
  app.put('/admin/restaurant/:id/edit', authenticate, upload.single('image'), adminController.editRes)

  //使用者頁面
  app.get('/admin/user', authenticate, adminController.getUser)
  //修改使用者權限
  app.put('/admin/user/:id', authenticate, adminController.putUser)
}
