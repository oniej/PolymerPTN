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
    const {active, group,hotel,dateFrom,dateTo,rooms,note,seasondate } = req.body;
    if (!group || !hotel || !dateFrom || !dateTo || !note) {
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    allocation.active = active;
    allocation.group = group;
    allocation.hotel = hotel;
    allocation.dateFrom = dateFrom;
    allocation.dateTo = dateTo;
    allocation.rooms = rooms;
    allocation.note = note;
    allocation.seasondate = seasondate;
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
        const {active,group, hotel,dateFrom,dateTo,rooms,note,seasondate } = req.body;
        allocation.active = active;
        if (group) allocation.group = group;
        if (hotel) allocation.hotel = hotel;
        if (dateFrom) allocation.dateFrom = dateFrom;
        if (dateTo) allocation.dateTo = dateTo;
        if (rooms) allocation.rooms = rooms;
        if (note) allocation.note = note;
        if (seasondate) allocation.seasondate = seasondate;
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

router.get('/filter/:hotel', (req, res) => {
    const hotel = req.params.hotel;
    Allocation.findOne({ hotel: hotel }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});
router.get('/filterR/:room', (req, res) => {
    const room = req.params.room;
    Allocation.findOne({ room: room }, (error, rooms) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: rooms });
    });
});

router.get('/filterstartdate/:newdate', (req, res) => {
    const newdate = req.params.newdate;
    Allocation.find({ 'dateFrom': { $gte: newdate } }, (error, avilafilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: avilafilter });
    });
});
router.get('/filterenddate/:newdate1', (req, res) => {
    const newdate1 = req.params.newdate1;
    Allocation.find({ 'dateFrom': { $lte: newdate1 } }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
}); 
router.get('/filterstartdate/:newdate', (req, res) => {
    const [newdate, newdate1] = req.params.newdate.split("_");
    Allocation.find({ dateFrom: { $gte: newdate, $lte: newdate1 } }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterenddate/:newdate1', (req, res) => {
    const [newdate1, newdate] = req.params.newdate1.split("_");
    Allocation.find({ dateTo: { $lte: newdate1, $gte: newdate } }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
module.exports = router;