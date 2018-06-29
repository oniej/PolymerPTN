// first we import our dependencies…
const express = require('express');
const Group = require('../models/group');
const router = express.Router();

// and create our instances


router.get('/readMe/:editKey', (req, res) => {
    const editKey = req.params.editKey
    Group.findById({ _id: editKey }, (error, group) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: group });
    });
});
router.get('/read', (req, res) => {
    Group.find((err, groups) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: groups });
    }).sort({ _id: -1 }).limit(20);
});

router.post('/add', (req, res) => {
    const groupAdd = new Group();
    const { group } = req.body;
    groupAdd.group = group;
    groupAdd.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    Group.findById(editKey, (error, groups) => {
        if (error) return res.json({ success: false, error });
        const { group } = req.body;
        groups.group = group;
        groups.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});
router.delete('/delete/:editKey', (req, res) => {
    const { editKey } = req.params;
    console.log(editKey);
    // if (!editKey) {
    //     return res.json({ success: false, error: 'No comment id provided' });
    // }
    // Group.remove({ _id: editKey }, (error, hotel) => {
    //     if (error) return res.json({ success: false, error });
    //     return res.json({ success: true });
    // });
});
// router.delete('/delete/:editKey', (req, res) => {
//     const { editKey } = req.params;
//     Group.remove({ _id: editKey }, (error, group) => {
//         if (error) return res.json({ success: false, error });
//         return res.json({ success: true });
//     });
// });

module.exports = router;