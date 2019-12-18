const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const flash = require('connect-flash');

const connectDB = require('./config/db.js');
app.use(cors());

require('./config/passport')(passport);

//Express Session Middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

connectDB();

require('./models/users');
require('./models/search');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

//global variables
app.use(function(req, res, next) {
  console.log('--------inside middleware---------');
  console.log(req.flash('success_msg'));

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
//app.use('/', require('./routes/users'));
app.use('/api/user', require('./routes/users'));
app.use('/api/search', require('./routes/search'));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

app.post('/', cors(), (req, res) => {
  console.log('------------hey !');
});

// const PORT = process.env.PORT || 8080;
app.listen(5000, () => {
  console.log('running on p ort 3000');
});
