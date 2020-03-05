const resService = require('../../services/resService')

const resController = {
  getRes: (req, res) => {
    resService.getRes(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = resController