const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    // check header or url parameters or post parameters for token
    console.log('-----headers-----', req.headers);
    var token = req.headers.authorization.split(' ')[1];
    console.log(token);
    console.log('in middleware');
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, config.get('secret'), function(err, decoded) {
        if (err) {
          console.log(err);
          return res.status(401).send({
            success: false,
            message: 'Failed to authenticate token'
          });
        } else {
          console.log(' token verified', decoded);

          req.username = decoded.username;
          console.log(decoded.username, decoded.email);
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
