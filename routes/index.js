const resController = require('../controllers/resController')
const adminController = require('../controllers/adminController')

module.exports = app => {
  app.get('/', (req, res) => { res.redirect('/restaurant') })
  app.get('/restaurant', resController.getRes)
  app.get('/admin', (req, res) => { res.redirect('/admin/restaurant') })
  app.get('/admin/restaurant', adminController.getRes)
}
