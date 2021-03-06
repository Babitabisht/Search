const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const connectDB = require('./config/db.js');
app.use(cors());

require('./config/passport')(passport);

//Express Session Middleware
app.use(
  session({
    secret: process.env.secret,
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
app.use('/', require('./routes/index'));
app.use('/api/user', require('./routes/users'));
app.use('/api/search', require('./routes/search'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
