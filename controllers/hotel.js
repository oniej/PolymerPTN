// first we import our dependencies…
const express = require('express');
const Hotels = require('../models/hotels_model');

// and create our instances
const router = express.Router();

// router.get('/count', (req, res) => {
//     Hotels.count((err, hotels) => {
//         return res.json({ success: true, data: hotels });
//     });
// });
router.get('/dummy', (req, res) => {
    return res.json({ success: true, data: [] });
});
router.get('/readMe/:editkey', (req, res) => {
    const editkey = req.params.editkey;
    Hotels.findById({ _id: editkey }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});

router.get('/read', (req, res) => {
    Hotels.find((err, hotels) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: hotels });
    }).limit(20);
});

router.post('/add', (req, res) => {
    const hotelAdd = new Hotels();
    // body parser lets us use the req.body
    const { hotel, room1, room2, room3, created_by, updated_by } = req.body;
    if (!hotel || !room1) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Provide name of hotel and room'
        });
    }
    hotelAdd.hotel = hotel;
    hotelAdd.room1 = room1;
    hotelAdd.room2 = room2;
    hotelAdd.room3 = room3;
    hotelAdd.created_by = created_by;
    hotelAdd.updated_by = updated_by;
    hotelAdd.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'No hotel id provided' });
    }
    Hotels.findById(editKey, (error, hotelinfo) => {
        if (error) return res.json({ success: false, error });
        const { hotel, room1, room2, room3 } = req.body;
        if (hotel) hotelinfo.hotel = hotel;
        if (room1) hotelinfo.room1 = room1;
        if (room2) hotelinfo.room2 = room2;
        if (room3) hotelinfo.room3 = room3;
        hotelinfo.save(error => {
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
    Hotels.remove({ _id: editKey }, (error, hotel) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});

module.exports = router;