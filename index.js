const prpl = require('prpl-server');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

// and create our instances
const app = express();
const config = require('./config/database');
const CommentController = require('./controllers/hotel');
const UserController = require('./controllers/user');
const AvailabilityController = require('./controllers/availability');
const AllocationController = require('./controllers/allocation');
const BlockingController = require('./controllers/blocking');
const GroupController = require('./controllers/group');
const BookingCcontroller = require('./controllers/booking');
const AgentController = require('./controllers/agent');
// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.PORT || 8080;

// now we should configure the API to use bodyParser and look for JSON data in the request body
// db config — set your URI from mLab in database.js

mongoose.connect(config.db);
mongoose.connection.on('connected', () => { console.log('MongoDB connection established\nReady...') });
mongoose.connection.on('error', (err) => { console.log('MongoDB connection error:' + err) });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use('/availability', AvailabilityController);
app.use('/allocation', AllocationController);
app.use('/group', GroupController);
app.use('/agent', AgentController);
app.use('/blocking', BlockingController);
app.use('/hotel', CommentController);
app.use('/user', UserController);
app.use('/group', GroupController);
app.use('/booking', BookingCcontroller);
app.get('/api/launch', (req, res, next) => res.send('boom'));

app.get('*', prpl.makeHandler('.', {
  builds: [
    { name: '/', browserCapabilities: ['es2015', 'push'] },
    { name: 'fallback' },
  ],
}));

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));