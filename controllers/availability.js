// first we import our dependencies…
const express = require('express');
const Availability = require('../models/availability_model');

// and create our instances
const router = express.Router();

router.get('/dummy', (req, res) => {
    return res.json({ success: true, data: [] });
});
router.post('/add', (req, res) => {
    const availabilityAdd = new Availability();
    const { hotel, notes, room1, room2, room3, created_by, updated_by, } = req.body;
    if (!hotel) {
        return res.json({
            success: false,
            error: 'Provide name of hotel and room'
        });
    }
    availabilityAdd.hotel = hotel;
    availabilityAdd.notes = notes;
    availabilityAdd.room1 = room1,
        availabilityAdd.room2 = room2,
        availabilityAdd.room3 = room3,
        // availabilityAdd.date = date,
        // console.log(room2)
        availabilityAdd.created_by = created_by;
    availabilityAdd.updated_by = updated_by;
    availabilityAdd.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
router.get('/search', (req, res) => {
    Availability.find({ "hotel": "Pacific" }, (err, availability) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: availability });
    });
});
router.get('/read', (req, res) => {
    Availability.find((err, availability) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: availability });
    }).sort({ _id: -1 }).limit(20);
});
router.get('/readEdit/:editKey', (req, res) => {
    const editKey = req.params.editKey;
    Availability.findById({ _id: editKey }, (error, hotels) => {
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
    Availability.findById(editKey, (error, availability) => {
        if (error) return res.json({ success: false, error });
        const { hotel, notes, room1, room2, room3, updated_by, created_by, } = req.body;
        if (hotel) availability.hotel = hotel;
        if (notes) availability.notes = notes;
        if (room1) availability.room1 = room1;
        if (room2) availability.room2 = room2;
        if (room3) availability.room3 = room3;
        if (updated_by) availability.updated_by = updated_by;
        if (created_by) availability.created_by = created_by;
        availability.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});
router.delete('/delete/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'No comment id provided' });
    }
    Availability.remove({ _id: editKey }, (error, hotel) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});

module.exports = router;