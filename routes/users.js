const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../helper/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
//Load Idea Model
require('../models/users');
const Users = mongoose.model('users');

//register form post
router.post('/register', (req, res) => {
  console.log('################# in register ####################');

  console.log(req.body);
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
      console.log('email already registred');
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
              console.log('---after then------', user);

              //  req.flash('success_msg', 'you are now registered and can log in');
              console.log('successful');
              res.send({
                success: true,
                message: 'registration successful, you can now log in !'
              });
              // res.redirect('/users/login');
            })
            .catch(err => {
              console.log(err);
              return;
            });
        });
      });
    }
  });
});

//login form post

router.post('/login', (req, res, next) => {
  console.log('################# in Login  POST####################');
  console.log(req.body);
  const username = req.body.email;
  const password = req.body.password;
  console.log(`username=${username}`);

  Users.findOne({ email: username }, (err, user) => {
    if (err) throw err;
    if (!user) {
      console.log('................');

      return res.json({ success: false, msg: 'User not found ' });
    }
    Users.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        console.log('yeah !');
        // console.log(user)
        // console.log(config.secret)
        const token = jwt.sign(user.toJSON(), config.get('secret'), {
          expiresIn: 604800
        });
        console.log(token);
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
        return res.json({ success: false, msg: 'no match' });
      }
    });
  });
});

router.get('/login', (req, res) => {
  console.log('################# in Login  GET####################');
  res.send({ success: false, message: 'login again !' });
});

//logout

router.get('/logout', (req, res) => {
  req.logout();

  res.send({ success: true, message: 'logged out successfuly' });
});

router.get('/dashboard', (req, res) => {
  console.log(
    '########################## In dashboard ##############################'
  );

  res.send({ success: true, message: 'welcome in dashboard' });
});

module.exports = router;
