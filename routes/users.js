const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../helper/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
var log4js = require('log4js');
var logger = log4js.getLogger();
//Load Idea Model
require('../models/users');
const Users = mongoose.model('users');

//register form post
router.post('/register', (req, res) => {
  logger.info('################# in register ####################');

  logger.info(req.body);
  let errors = [];

  if (req.body.password != req.body.confirmPassword) {
    res.send({ success: false, message: "passwords don't match" });
  }
  if (req.body.password.length < 4) {
    res.send({
      success: false,
      message: 'Password must be at least 4 characters'
    });
  }

  Users.findOne({ email: req.body.email }).then(user => {
    if (user) {
      //req.flash('error_msg', 'Email address already exit');
      logger.info('email already registred');
      res.send({ success: false, message: 'email already exist' });
      // res.redirect('/users/register');
    } else {
      const newUser = new Users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then(user => {
              logger.info('---after then------', user);

              //  req.flash('success_msg', 'you are now registered and can log in');
              logger.info('successful');
              res.send({
                success: true,
                message: 'registration successful, you can now log in !'
              });
              // res.redirect('/users/login');
            })
            .catch(err => {
              logger.info(err);
              return;
            });
        });
      });
    }
  });
});

//login form post

router.post('/login', (req, res, next) => {
  logger.info('################# in Login  POST####################');
  logger.info(req.body);
  const username = req.body.email;
  const password = req.body.password;
  logger.info(`username=${username}`);

  Users.findOne({ email: username }, (err, user) => {
    if (err) throw err;
    if (!user) {
      logger.info('................');

      return res.json({
        success: false,
        message: 'Incorrect email or password'
      });
    }
    Users.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        logger.info('yeah !');
        // logger.info(user)
        // logger.info(config.secret)
        const token = jwt.sign(user.toJSON(), process.env.secret, {
          expiresIn: 604800
        });
        logger.info(token);
        res.json({
          success: true,
          token: 'Bearer ' + token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({
          success: false,
          message: 'Incorrect email or password'
        });
      }
    });
  });
});

//logout

router.get('/logout', (req, res) => {
  req.logout();

  res.send({ success: true, message: 'logged out successfuly' });
});

module.exports = router;
