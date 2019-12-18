const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../helper/auth');

//Load Idea Model
require('../models/search');
const Search = mongoose.model('search');

router.post('/recordSearchItems', ensureAuthenticated, (req, res) => {
  console.log('-------------------in recordSearchItems----- ');

  const searchItem = new Search({
    user: req.user.id,
    searchItem: req.body.searchItem
  });

  searchItem.save().then(item => {
    console.log('----after storing searchitem-----', item);

    res.send({ success: true, message: 'successfuly saved !' });
  });
});

module.exports = router;
