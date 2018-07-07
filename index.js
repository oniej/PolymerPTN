const prpl = require('prpl-server');
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const passportlocalMongoose = require('passport-local-mongoose');
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = ('./models/user')

// and create our instances
const app = express();
const CommentController = require('./controllers/hotel');
const UserController = require('./controllers/users');
const AvailabilityController = require('./controllers/availability');
const AllocationController = require('./controllers/allocation');

const GroupController = require('./controllers/group');

const BlockingController = require('./controllers/blocking');
const GroupController = require('./controllers/group');
const AgentController = require('./controllers/agent');
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
// app.use(expressSession({
//   secret: 'Die Hard',
//   resave: true,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
app.use('/availability', AvailabilityController);
app.use('/allocation', AllocationController);
app.use('/group', GroupController);
app.use('/agent', AgentController);
app.use('/blocking', BlockingController);
app.use('/hotel', CommentController);
app.use('/users', UserController);
app.use('/group', GroupController);
app.get('/api/launch', (req, res, next) => res.send('boom'));

app.get('*', prpl.makeHandler('.', {
  builds: [
    { name: '/', browserCapabilities: ['es2015', 'push'] },
    { name: 'fallback' },
  ],
}));

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));