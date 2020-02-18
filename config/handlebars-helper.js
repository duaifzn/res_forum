module.exports = {
  ifCond: function (a, b, option) {
    if (a === b) {
      return options.fn(this)
    }
    else {
      return options.inverse(this)
    }
  }

}