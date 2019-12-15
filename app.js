const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors');

const connectDB = require('./config/db.js');

connectDB();
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
app.use('/api/user', require('./routes/users'));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // console.log('running on ort 3000');
});
