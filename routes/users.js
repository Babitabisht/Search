const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../helper/auth');

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

  passport.authenticate('local', {
    successRedirect: '/api/user/dashboard',
    failureRedirect: '/api/user/login',
    failureFlash: true
  })(req, res, next);
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
