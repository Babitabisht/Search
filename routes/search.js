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
    searchItem: req.body.item,
    username: req.body.user.username,
    email: req.body.user.email
  });

  console.log('--searchItem---', searchItem);

  searchItem.save().then(item => {
    console.log('----after storing searchitem-----', item);

    res.send({ success: true, message: 'successfuly saved !' });
  });
});

router.post('/searchHistory', (req, res) => {
  console.log('-------------------in searchHistory------------- ');

  console.log(req.body);

  Search.find({ username: req.body.username, email: req.body.email }).then(
    items => {
      searchItems = items.map(item => {
        return item.searchItem;
      });

      res.send({ success: true, message: searchItems });
    }
  );
});

module.exports = router;
