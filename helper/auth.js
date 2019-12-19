const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    var token = req.headers.authorization.split(' ')[1];
    console.log(token);

    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.secret, function(err, decoded) {
        if (err) {
          console.log(err);
          return res.status(401).send({
            success: false,
            message: 'Failed to authenticate token'
          });
        } else {
          console.log(' token verified', decoded);

          req.username = decoded.username;

          req.email = decoded.email;

          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(401).send({
        success: false,
        message: 'Failed to authenticate token'
      });
    }
  }
};
