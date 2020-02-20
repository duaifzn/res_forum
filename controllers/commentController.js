const db = require('../models')
const Comment = db.Comment

const commentController = {
  createComment: (req, res) => {
    Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    }).then(() => {
      return res.redirect(`/restaurant/${req.body.restaurantId}`)
    })
  },
  deleteComment: (req, res) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then((comment) => {
            //console.log('comment:::::', comment)
            return res.redirect(`/restaurant/${comment.RestaurantId}`)
          })
      })
  }
}

module.exports = commentController

