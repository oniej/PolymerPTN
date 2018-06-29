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
    const { active, workspace, hotel, dateFrom, dateTo, rooms, note, seasondate } = req.body;
    if (!workspace || !hotel || !dateFrom || !dateTo || !note) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    allocation.active = active;
    allocation.workspace = workspace;
    allocation.hotel = hotel;
    allocation.dateFrom = dateFrom;
    allocation.dateTo = dateTo;
    allocation.rooms = rooms;
    // allocation.room1 = room1;
    // allocation.peak = peak;
    // allocation.pdays = pdays;
    // allocation.nonpeak = nonpeak;
    // allocation.nonpdays = nonpdays;
    allocation.note = note;
    allocation.seasondate = seasondate;
    // allocation.startValue = startValue;
    // allocation.endValue = endValue;
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
        const { active, workspace, hotel, dateFrom, dateTo, rooms, note, seasondate } = req.body;
        allocation.active = active;
        if (workspace) allocation.workspace = workspace;
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
router.get('/filter/:group', (req, res) => {
    const group = req.params.group;
    Allocation.find({ group: group }, (error, group) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: group });
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