const express = require('express');

const router = express.Router();
const Url = require('../models/Url');

router.get('/', async (req, res) => {
  try {
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
