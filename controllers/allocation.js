// first we import our dependencies…
const express = require('express');
const Allocation = require('../models/allocation');

// and create our instances
const router = express.Router();

router.get('/dummy', (req, res) => {
    return res.json({ success: true, data: [] });
});
router.post('/add', (req, res) => { 
    const allocation = new Allocation();
    // body parser lets us use the req.body
    const {hotel,dateFrom,dateTo,room,peak,pdays,nonpeak,nonpdays,note,startValue,endValue } = req.body;
    if (!hotel || !dateFrom || !dateTo || !note) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    allocation.hotel = hotel;
    allocation.dateFrom = dateFrom;
    allocation.dateTo = dateTo;
    allocation.room = room;
    // allocation.room1 = room1;
    allocation.peak = peak;
    allocation.pdays = pdays;
    allocation.nonpeak = nonpeak;
    allocation.nonpdays = nonpdays;
    allocation.note = note;
    allocation.startValue = startValue;
    allocation.endValue = endValue;
    allocation.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
router.get('/read', (req, res) => {
    Allocation.find((err, allocation) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: allocation });
    }).limit(20);
});
router.get('/readEdit/:editKey', (req, res) => {
    const editKey = req.params.editKey;
    Allocation.findById({ _id: editKey }, (error, hotels) => {
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
    Allocation.findById(editKey, (error, allocation) => {
        if (error) return res.json({ success: false, error });
        const { hotel,dateFrom,dateTo,room,peak,peaknumday,nonpeak,nonpeaknumday,note,startValue,endValue } = req.body;
        if (hotel) allocation.hotel = hotel;
        if (dateFrom) allocation.dateFrom = dateFrom;
        if (dateTo) allocation.dateTo = dateTo;
        if (room) allocation.room = room;
        if (peak) allocation.peak = peak;
        if (peaknumday) allocation.peaknumday = peaknumday;
        if (nonpeak) allocation.nonpeak = nonpeak;
        if (nonpeaknumday) allocation.nonpeaknumday = nonpeaknumday;
        if (note) allocation.note = note;
        if (startValue) allocation.startValue = startValue;
        if (endValue) allocation.endValue = endValue;
        allocation.save(error => {
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
    Allocation.remove({ _id: editKey }, (error, hotel) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});

module.exports = router;