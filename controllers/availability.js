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
    const { hotel, notes, availabilities, date, type, month, created_by, updated_by, } = req.body;
    if (!hotel) {
        return res.json({
            success: false,
            error: 'Provide name of hotel and room'
        });
    }
    availabilityAdd.hotel = hotel,
        availabilityAdd.notes = notes,
        availabilityAdd.availability = availabilities,
        availabilityAdd.month = month,
        availabilityAdd.date = date,
        availabilityAdd.type = type,
        availabilityAdd.created_by = created_by,
        availabilityAdd.updated_by = updated_by,
    availabilityAdd.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });

});
router.get('/read', (req, res) => {
    Availability.find((err, availability) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: availability });
    }).sort({ _id: 1 }).limit(20);
});
router.get('/readEdit/:editKey', (req, res) => {
    const editKey = req.params.editKey;
    Availability.findById({ _id: editKey }, (error, availability) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: availability });
    });
});
router.get('/filter/:hotel', (req, res) => {
    const [hotel, month, yearly] = req.params.hotel.split("~");
    var date = month + "," + yearly;
    Availability.find({ $and: [{ hotel: hotel }, { date: date }] }, (error, availability) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: availability });
    });
});
router.put('/edit/:editId', (req, res) => {
    const { editId } = req.params;
    if (!editId) {
        return res.json({ success: false, error: 'not match found' });
    }
    Availability.findById(editId, (error, availability) => {
        if (error) return res.json({ success: false, error });
        const { hotel, notes, availabilities, type, date, month, updated_by, created_by, } = req.body;
        availability.hotel = hotel,
            availability.notes = notes,
            availability.availability = availabilities,
            availability.type = type,
            availability.month = month,
            availability.date = date,
            availability.updated_by = updated_by,
            availability.created_by = created_by;
        availability.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });

    });
});
router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'not match found' });
    }
    Availability.findById(editKey, (error, availability) => {
        if (error) return res.json({ success: false, error });
        const { hotel, notes, availabilities, type, date, month, updated_by, created_by, } = req.body;
        availability.hotel = hotel,
            availability.notes = notes,
            availability.availability = availabilities,
            availability.type = type,
            availability.month = month,
            availability.date = date,
            availability.updated_by = updated_by,
            availability.created_by = created_by;
        availability.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });

    });
});
router.delete('/delete/:hotel', (req, res) => {
    const { hotel } = req.params;
    if (!hotel) {
        return res.json({ success: false, error: 'No comment id provided' });
    }
    Availability.remove({ hotel: hotel }, (error, hotel) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});
module.exports = router;