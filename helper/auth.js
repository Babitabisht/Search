module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.send({
      success: false,
      message: 'Unauthorize access, please log in !'
    });
  }
};
