// first we import our dependencies…
const express = require('express');
const Hotels = require('../models/hotels_model');

// and create our instances
const router = express.Router();

router.get('/count', (req, res) => {
    Hotels.count((err, hotels) => {
        return res.json({ success: true, data: hotels });
    });
});
router.get('/read/:editKey', (req, res) => {
    const { editKey } = req.params;
    Hotels.findById(editKey, (error, hotelinfo) => {
        if (error) return res.json({ success: false, error });
        // const { hotel, room } = req.body;
        // if (hotel) hotelinfo.hotel = hotel;
        // if (room) hotelinfo.room = room;
        return res.json({ success: true, data: hotelinfo })
    });
});

router.get('/filter/:hotel', (req, res) => {
    const hotel = req.params.hotel;
    Hotels.findOne({ hotel: hotel }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});

router.get('/read', (req, res) => {
    Hotels.find((err, hotels) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: hotels });
    }).limit(20);
    // var data = Comment.count((err, comments) => {
    //     return res.json({ success: true, data: comments });
    // });
});

router.get('/filter/:hotel', (req, res) => {
    const hotel = req.params.hotel;
    Hotels.findOne({ hotel: hotel }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});

router.post('/add', (req, res) => {
    const hotelAdd = new Hotels();
    // body parser lets us use the req.body

    const { hotel, room, created_by, updated_by } = req.body;

    const { hotel, room } = req.body;

    if (!hotel || !room) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Provide name of hotel and room'
        });
    }
    hotelAdd.hotel = hotel;
    hotelAdd.room = room;

    hotelAdd.created_by = created_by;
    hotelAdd.updated_by = updated_by;
    hotelAdd.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
// router.get('/readEdit', (req, res) => {
//     Hotels.findOne({},
//         { hotel: 1, room: 1 })
// })

router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'No hotel id provided' });
    }
    Hotels.findById(editKey, (error, hotelinfo) => {
        if (error) return res.json({ success: false, error });

        const { hotel, room, } = req.body;
        hotelinfo.hotel = hotel;
        hotelinfo.room = room;

        const { hotel, room } = req.body;
        if (hotel) hotelinfo.hotel = hotel;
        if (room) hotelinfo.room = room;

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