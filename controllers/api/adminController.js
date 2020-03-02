const adminService = require('../../services/adminService')

const adminController = {
  adminGetRes: (req, res) => {
    adminService.adminGetRes(req, res, (data) => {
      return res.json(data)
    })
  },
  createRes: (req, res) => {
    adminService.createRes(req, res, (data) => {
      return res.json(data)
    })
  },

  getRes: (req, res) => {
    adminService.getRes(req, res, (data) => {
      return res.json(data)
    })
  },
  getAllCategory: (req, res) => {
    adminService.getAllCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteRes: (req, res) => {
    adminService.deleteRes(req, res, (data) => {
      return res.json(data)
    })
  },
  editRes: (req, res) => {
    adminService.editRes(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.json(data['message'])
      }
    })
  },
  createCategory: (req, res) => {
    adminService.createCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.json(data['message'])
      }
    })
  },
  editCategory: (req, res) => {
    adminService.editCategory(req, res, (data) => {
      return res.json(data['message'])
    })
  },
  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, (data) => {
      return res.json(data['message'])
    })
  }
}

module.exports = adminController