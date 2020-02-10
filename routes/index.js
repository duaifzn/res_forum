const resController = require('../controllers/resController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
module.exports = (app, passport) => {
  const authenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
    }
    res.redirect('/signin')
  }
  app.get('/', authenticate, (req, res) => { res.redirect('/restaurant') })
  app.get('/restaurant', authenticate, resController.getRes)
  app.get('/admin', isAdmin, (req, res) => { res.redirect('/admin/restaurant') })
  app.get('/admin/restaurant', isAdmin, adminController.getRes)
  app.get('/signup', authenticate, userController.signUpPage)
  app.post('/signup', authenticate, userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logOut)
}
