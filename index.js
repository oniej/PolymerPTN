const prpl = require('prpl-server');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportlocalMongoose = require('passport-local-mongoose');
const User = ('./models/user')

// and create our instances
const app = express();
const CommentController = require('./controllers/hotel');
const UserController = require('./controllers/users');
const AvailabilityController = require('./controllers/availability');

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.PORT || 8080;

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// middleware config
app.use(cors());

// db config — set your URI from mLab in database.js

mongoose.connect('mongodb://admin:admin@ds143907.mlab.com:43907/ptn_availability');
mongoose.connection.on('connected', () => { console.log('MongoDB connection established\nReady...') });
mongoose.connection.on('error', (err) => { console.log('MongoDB connection error:' + err) });

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(require("express-session")({
//   secret: "",
//   resave: false,
//   saveUninitialized: false
// }));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
app.use('/availability', AvailabilityController);
app.use('/hotel', CommentController);
app.use('/users', UserController);
app.get('/api/launch', (req, res, next) => res.send('boom'));

app.get('*', prpl.makeHandler('.', {
  builds: [
    { name: '/', browserCapabilities: ['es2015', 'push'] },
    { name: 'fallback' },
  ],
}));

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));