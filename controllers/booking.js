// first we import our dependencies…
const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();

// and create our instances

router.get('/readEdit/:editKey', (req, res) => {
    const editKey = req.params.editKey
    Booking.findById({ _id: editKey }, (error, book) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: book });
    });
});
router.get('/read', (req, res) => {
    Booking.find((err, booking) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: booking });
    }).sort({ _id: -1 }).limit(20);
});

router.post('/add', (req, res) => {
    const booking = new Booking();
    const { reference, guest, agent,agentname, hotel, hoetlname, room, roomname, checkin, checkout, numrooms, deduction } = req.body;
    booking.reference = reference;
    booking.guest = guest;
    booking.agent = agent;
    booking.agentname = agentname,
    booking.hotel = hotel;
    booking.hoetlname = hoetlname;
    booking.room = room;
    booking.roomname = roomname;
    booking.checkin = checkin;
    booking.checkout = checkout;
    booking.numrooms = numrooms;
    booking.deduction = deduction;
    booking.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.put('/update/:editKey', (req, res) => {
    const { editKey } = req.params;
    Booking.findById(editKey, (error, books) => {
        if (error) return res.json({ success: false, error });
        const { reference, guest, agent,agentname, hotel,hotelname, room,roomname, checkin, checkout, numrooms, deduction } = req.body;
        books.reference = reference;
        books.guest = guest;
        books.agent = agent;
        books.agentname = agentname,
        books.hotel = hotel;
        books.hotelname = hotelname;
        books.room = room;
        books.roomname = roomname;
        books.checkin = checkin;
        books.checkout = checkout;
        books.numrooms = numrooms;
        books.deduction = deduction;
        books.save(error => {
            if (error) return res.json({ success: false, error });
            return res.json({ success: true });
        });
    });
});
router.delete('/delete/:editKey', (req, res) => {
    const { editKey } = req.params;
    if (!editKey) {
        return res.json({ success: false, error: 'no id Seleccted' });
    }
    Booking.remove({ _id: editKey }, (error, id) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
    });
});
module.exports = router;