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
    const {active, agent, group,hotel,hotelname,room,roomname,dateFrom,dateTo,block,cancel,note, updated_by, created_by} = req.body;
    if (!group || !hotel || !note) {
        // we should throw an error. we can do this check on the front end
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    blocking.active = active;
    blocking.agent = agent;
    blocking.group = group;
    blocking.hotel = hotel;
    blocking.hotelname = hotelname;
    // blocking.dateFrom = dateFrom;
    // blocking.dateTo = dateTo;
    // blocking.rooms = rooms;
    blocking.room = room;
    blocking.roomname = roomname;
    blocking.dateFrom = dateFrom;
    blocking.dateTo = dateTo;
    blocking.block = block;
    blocking.cancel = cancel;
    blocking.note = note;
    blocking.updated_by = updated_by,
    blocking.created_by = created_by;
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
        const {active, agent, hotelname,room,roomname,dateFrom,dateTo,block,cancel,note, updated_by, created_by } = req.body;
        blocking.active = active;
        // if (group) blocking.group = group;
        if (agent) blocking.agent = agent;
        // if (hotel) blocking.hotel = hotel;
        
        if (hotelname) blocking.hotelname = hotelname;
        // if (rooms) blocking.rooms = rooms;
        blocking.room = room;
        blocking.roomname = roomname;
        blocking.dateFrom = dateFrom;
        blocking.dateTo = dateTo;
        blocking.block = block;
        blocking.cancel = cancel;
        if (note) blocking.note = note;
        blocking.updated_by = updated_by,
        blocking.created_by = created_by;
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

router.get('/filterblock/:newdate', (req, res) => {
    const [hotel, newdate, newdate2] = req.params.newdate.split("_");
    Blocking.find({
        $and: [
            { hotel: hotel },
            { 'rooms.dateFrom': { $lte: newdate} },
            { 'rooms.dateTo': { $gte: newdate2} }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterblockR/:newdate', (req, res) => {
    const [room, newdate, newdate2] = req.params.newdate.split("_");
    Blocking.find({
        $and: [
            { 'rooms.room': room },
            { 'rooms.dateFrom': { $gte: newdate} },
            { 'rooms.dateTo': { $lte: newdate2} }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterblockF/:newdate', (req, res) => {
    const [hotel, room, newdate, newdate2] = req.params.newdate.split("_");
    Blocking.find({
        $and: [
            { hotel: hotel },
            { 'rooms.room': room },
            { 'rooms.dateFrom': { $gte: newdate} },
            { 'rooms.dateTo': { $lte: newdate2} }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterblockD/:newdate', (req, res) => {
    const [newdate, newdate2] = req.params.newdate.split("_");
    Blocking.find({
        $and: [
            { 'rooms.dateFrom': { $gte: newdate} },
            { 'rooms.dateTo': { $lte: newdate2} }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterA/:agentKey', (req, res) => {
    const agentKey = req.params.agentKey;
    Blocking.find({ agent: agentKey }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});
router.get('/filterB/:hotelKey', (req, res) => {
    const [hotelKey, agentKey] = req.params.hotelKey.split("_");
    Blocking.find({ 
        $and: [
        {hotel: hotelKey},
        { agent: agentKey }
        ]
    }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});
module.exports = router;