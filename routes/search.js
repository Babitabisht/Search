const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../helper/auth');
var log4js = require('log4js');
var logger = log4js.getLogger();
//Load Idea Model
require('../models/search');
const Search = mongoose.model('search');

router.post('/recordSearchItems', ensureAuthenticated, (req, res) => {
  logger.info(' ###########in recordSearchItems ########## ');

  const searchItem = new Search({
    searchItem: req.body.item,
    username: req.body.user.username,
    email: req.body.user.email
  });

  logger.info('--searchItem---', searchItem);

  searchItem.save().then(item => {
    logger.info('----after storing searchitem-----', item);

    res.send({ success: true, message: 'successfuly saved !' });
  });
});

router.post('/searchHistory', ensureAuthenticated, (req, res) => {
  logger.info('#####################in searchHistory ################## ');

  logger.info(req.body);

  Search.find({ username: req.body.username, email: req.body.email }).then(
    items => {
      searchItems = items.map(item => {
        return { searchItem: item.searchItem, date: item.date };
      });

      res.send({ success: true, message: searchItems });
    }
  );
});

module.exports = router;
