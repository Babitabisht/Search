const mongoose = require('mongoose');
require('../models/users');

const User = mongoose.model('users');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const config = require('config');

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.secret;

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.getUserById(jwt_payload._id, (err, user) => {
        if (err) {
          console.log('error in authenticating ');
          return done(err, false);
        }
        if (user) {
          console.log('done user __________===========');
          return done(null, user);
        } else {
          console.log('done __________===========');
          return done(null, false);
        }
      });
    })
  );
};
