// first we import our dependencies…
const express = require('express');
const Blocking = require('../models/blocking');

// and create our instances
const router = express.Router();

router.get('/dummy', (req, res) => {
    return res.json({ success: true, data: [] });
});
router.post('/add', (req, res) => { 
    const blocking = new Blocking();
    // body parser lets us use the req.body
    const {active, workspace,hotel,dateFrom,dateTo,rooms,note,seasondate } = req.body;
    if (!workspace || !hotel || !dateFrom || !dateTo || !note) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    blocking.active = active;
    blocking.workspace = workspace;
    blocking.hotel = hotel;
    blocking.dateFrom = dateFrom;
    blocking.dateTo = dateTo;
    blocking.rooms = rooms;
    // blocking.room1 = room1;
    // blocking.peak = peak;
    // blocking.pdays = pdays;
    // blocking.nonpeak = nonpeak;
    // blocking.nonpdays = nonpdays;
    blocking.note = note;
    blocking.seasondate = seasondate;
    // blocking.startValue = startValue;
    // blocking.endValue = endValue;
    blocking.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
router.get('/read', (req, res) => {
    Blocking.find((err, blocking) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: blocking });
    }).limit(20);
});
router.get('/readEdit/:editKey', (req, res) => {
    const editKey = req.params.editKey;
    Blocking.findById({ _id: editKey }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        // console.log(hotels);
        return res.json({ success: true, data: hotels });
    });
});


router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'not match found' });
    }
    Blocking.findById(editKey, (error, blocking) => {
        if (error) return res.json({ success: false, error });
        const {active, workspace, hotel,dateFrom,dateTo,rooms,note,seasondate } = req.body;
        blocking.active = active;
        if (workspace) blocking.workspace = workspace;
        if (hotel) blocking.hotel = hotel;
        if (dateFrom) blocking.dateFrom = dateFrom;
        if (dateTo) blocking.dateTo = dateTo;
        if (rooms) blocking.rooms = rooms;
       
        if (note) blocking.note = note;
        if (seasondate) blocking.seasondate = seasondate;
 
        blocking.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});
router.delete('/delete/:editKey', (req, res) => {
    const { editKey } = req.params;
    // console.log(editKey);
    if (!editKey) {
        return res.json({ success: false, error: 'No comment id provided' });
    }
    Blocking.remove({ _id: editKey }, (error, hotel) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});

module.exports = router;