// first we import our dependencies…
const express = require('express');
const Users = require('../models/users_model');
const router = express.Router();
// const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
// const passport = require('passport');
// const localStrategy = require('passport-local');
// const passportlocalMongoose = require('passport-local-mongoose');

// and create our instances


router.get('/count', (req, res) => {
    Users.count((err, hotels) => {
        return res.json({ success: true, data: hotels });
    });
});
router.get('/dummy', (req, res) => {
    return res.json({ success: true, data: [] });
});
router.get('/readMe/:editKey', (req, res) => {
    const editKey = req.params.editKey
    Users.findById({ _id: editKey }, (error, user) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: user });
    });
});
router.get('/read', (req, res) => {
    Users.find((err, hotels) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: hotels });
    }).sort({ _id: -1 }).limit(20);
    // var data = Comment.count((err, comments) => {
    //     return res.json({ success: true, data: comments });
    // });
});

router.post('/add', (req, res) => {
    const usersAdd = new Users();
    // body parser lets us use the req.body
    const { fullname, email, role, group, active, account_key } = req.body;
    if (!fullname || !email || !role) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Provide name of hotel and room'
        });
    }
    usersAdd.account_key = account_key;
    usersAdd.fullname = fullname;
    usersAdd.email = email;
    usersAdd.account_type = role;
    usersAdd.group = group;
    usersAdd.active = active
    usersAdd.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
router.put('/block/:editKey', (req, res) => {
    const { editKey } = req.params;
    // console.log(editKey);
    if (!editKey) {
        return res.json({ success: false, error: 'not match found' });
    }
    Users.findById(editKey, (error, user) => {
        if (error) return res.json({ success: false, error });
        const { active } = req.body;
        if (active) user.active = active = false;
        user.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
            // console.log(this.return);
        });
    });
});
router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'not match found' });
    }
    Users.findById(editKey, (error, user) => {
        if (error) return res.json({ success: false, error });
        const { account_key, account_type, group, fullname, email, active } = req.body;
        user.account_key = account_key;
        user.account_type = account_type;
        user.group = group;
        user.fullname = fullname;
        user.email = email;
        // if (active == true) { user.active = true; } else { user.active = false; }
        user.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});

router.get('/login', (req, res) => {
    res.render('/availability');
});
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/users/login' }),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/availability/' + req.user.email);
        console.log(res);
    });
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Users.getUserById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new localStrategy(function (email, password, done) {
    Users.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Unknown User' });
        }
    })

}));
// UserSchema.statics.authenticate = function (email, password, callback) {
//     Users.findOne({ email: email })
//       .exec(function (err, user) {
//         if (err) {
//           return callback(err)
//         } else if (!user) {
//           var err = new Error('User not found.');
//           err.status = 401;
//           return callback(err);
//         }
//         bcrypt.compare(password, user.password, function (err, result) {
//           if (result === true) {
//             return callback(null, user);
//           } else {
//             return callback();
//           }
//         })
//       });
//   }
module.exports = router;