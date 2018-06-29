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
    const {active, group,hotel,rooms,note} = req.body;
    if (!group || !hotel || !note) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    blocking.active = active;
    blocking.group = group;
    blocking.hotel = hotel;
    // blocking.dateFrom = dateFrom;
    // blocking.dateTo = dateTo;
    blocking.rooms = rooms;
    blocking.note = note;
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
        const {active, group, hotel,rooms,note } = req.body;
        blocking.active = active;
        if (group) blocking.group = group;
        if (hotel) blocking.hotel = hotel;
        if (rooms) blocking.rooms = rooms;
        if (note) blocking.note = note;
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
router.get('/filter/:hotel', (req, res) => {
    const hotel = req.params.hotel;
    Blocking.findOne({ hotel: hotel }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});
router.get('/filterR/:room', (req, res) => {
    const room = req.params.room;
    Blocking.findOne({ room: room }, (error, rooms) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: rooms });
    });
});

router.get('/filterstartdate/:newdate', (req, res) => {
    const newdate = req.params.newdate;
    Blocking.find({ 'rooms.dateFrom': { $gte: newdate } }, (error, avilafilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: avilafilter });
    });
});
router.get('/filterenddate/:newdate1', (req, res) => {
    const newdate1 = req.params.newdate1;
    Blocking.find({ 'rooms.dateFrom': { $lte: newdate1 } }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterstartdate/:newdate', (req, res) => {
    const [newdate, newdate1] = req.params.newdate.split("_");
    Blocking.find({ dateFrom: { $gte: newdate, $lte: newdate1 } }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterenddate/:newdate1', (req, res) => {
    const [newdate1, newdate] = req.params.newdate1.split("_");
    Blocking.find({ dateTo: { $lte: newdate1, $gte: newdate } }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
module.exports = router;