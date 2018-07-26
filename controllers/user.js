// first we import our dependencies…
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserGroup = require('../models/group');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('../config/nodemailer');
const config = require('../config/database');
// const passport = require('passport');
// const localStrategy = require('passport-local');
// const passportlocalMongoose = require('passport-local-mongoose');

// and create our instances
router.post('/register', function (req, res) {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        accountkey: req.body.accountkey,
        isActive: false,
        isEmailVerified: false,
        group: req.body.group,
        role: req.body.role
    });

    User.saveUser(newUser, function (err, user) {
        if (err) {
            return res.json({ success: false, msg: 'User not registered. Due to:\n' + err });
        }

        nodemailer.sendNewUserRegistration(req.headers.host, user.email, user.accountkey, function (err, info) {
            if (err) res.json({ success: false, msg: err });
            else res.json({ success: true, msg: 'Email sent: ' + info.response });
        });
    });
});
router.post('/changePassword', function (req, res) {
    var email = req.body.email;
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var isLink = req.body.link;

    User.getUserByEmail(email, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: "Invalid code." });
        }

        User.comparePassword(oldpassword, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                if (isLink) {
                    user.isActive = true;
                    user.isEmailVerified = true;
                }
                user.password = newpassword;
                User.saveUser(user, function (err, user) {
                    if (err) return res.json({ success: false, msg: err });
                    res.json({ success: true, msg: 'Account activated.' });
                });
            } else {
                return res.json({ success: false, msg: "Activation denied." });
            }
        });

    });
});
router.post('/forgotPassword', function (req, res) {
    var email = req.body.email;
    var token = req.body.token;
    var host = req.headers.host;

    User.getUserByEmail(email, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: "No account with that email address exists." });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
            if (err) return res.json({ success: false, msg: err });
            nodemailer.sendPasswordReset(host, user.email, token, function (err, info) {
                if (err) return res.json({ success: false, msg: err });
                res.json({ success: true, msg: 'Email sent: ' + info.response });
            });
        });

    });
});
router.post('/resetPassword/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'Password reset token is invalid or has expired.' });
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        User.saveUser(user, function (err, user) {
            if (err) return res.json({ success: false, msg: err });
            nodemailer.sendPasswordChanged(user.email, function (err, info) {
                if (err) return res.json({ success: false, msg: err });
                res.json({ success: true, msg: 'Password changed.' });
            });
        });
    });
});

router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.getUserByEmail(email, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: "User not found." });
        }
        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                var token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 600000 });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        group: user.group,
                        accountkey: user.accountkey,
                        active: user.isActive
                    }
                });
            }
            else {
                res.json({ success: false, msg: "Password not match." });
            }
        });
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.json({ success: true, user: null });
});
router.get('/read', (req, res) => {
    User.find((err, user) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: user });
    }).sort({ _id: -1 }).limit(20);
});
router.get('/edit/:editkey', (req, res) => {
    const editkey = req.params.editkey;
    console.log(this.editkey);
    User.findById({ _id: editkey }, (error, users) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: users });
    });
});
router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'No hotel id provided' });
    }
    User.findById(editKey, (error, updateUser) => {
        if (error) return res.json({ success: false, error });
        const { name, email, role, group } = req.body;
        updateUser.name = name;
        updateUser.email = email;
        updateUser.role = role;
        updateUser.group = group;
        updateUser.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});
router.get('/getkey/:accountkey', (req, res) => {
    const accountkey = req.params.accountkey;
    User.findOne({ accountkey: accountkey }, (error, userload) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: userload });
    });
});
module.exports = router;