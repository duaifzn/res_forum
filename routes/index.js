const resController = require('../controllers/resController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
module.exports = (app, passport) => {
  app.get('/', (req, res) => { res.redirect('/restaurant') })
  app.get('/restaurant', resController.getRes)
  app.get('/admin', (req, res) => { res.redirect('/admin/restaurant') })
  app.get('/admin/restaurant', adminController.getRes)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)

}
