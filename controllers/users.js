// first we import our dependencies…
const express = require('express');
const Users = require('../models/users_model');
// const passport = require('passport');
// const localStrategy = require('passport-local');
// const passportlocalMongoose = require('passport-local-mongoose');

// and create our instances
const router = express.Router();

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
    }).limit(20);
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
        if (account_key) user.account_key = account_key;
        if (account_type) user.account_type = account_type;
        if (group) user.group = group;
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (active == true) { user.active = true; } else { user.active = false; }
        user.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});

router.delete('/delete/:commentId', (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res.json({ success: false, error: 'No comment id provided' });
    }
    Comment.remove({ _id: commentId }, (error, comment) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});

module.exports = router;