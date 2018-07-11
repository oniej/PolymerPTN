// first we import our dependencies…
const express = require('express');
const Allocation = require('../models/allocation');
const Allocation2 = require('../models/allocation');
const Blocking = require('../models/blocking');
const Booking = require('../models/booking');
const Availability = require('../models/availability_model');


// and create our instances
const router = express.Router();

router.get('/dummy', (req, res) => {
    return res.json({ success: true, data: [] });
});
router.post('/add', (req, res) => {
    const allocation = new Allocation();
    // body parser lets us use the req.body
    const { active, group, hotel, hotelname, dateFrom, dateTo, rooms, note, pk_coff, npk_coff, seasondate } = req.body;
    if (!group || !hotel || !dateFrom || !dateTo || !note) {
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    allocation.active = active;
    allocation.group = group;
    allocation.hotel = hotel;
    allocation.hotelname = hotelname;
    allocation.dateFrom = dateFrom;
    allocation.dateTo = dateTo;
    allocation.rooms = rooms;
    allocation.note = note;
    allocation.pk_coff = pk_coff;
    allocation.npk_coff = npk_coff;
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
        const { active, group, hotelname, dateFrom, dateTo, rooms, note, pk_coff, npk_coff, seasondate } = req.body;
        allocation.active = active;
        if (group) allocation.group = group;
        // if (hotel) allocation.hotel = hotel;
        if (hotelname) allocation.hotelname = hotelname;
        if (dateFrom) allocation.dateFrom = dateFrom;
        if (dateTo) allocation.dateTo = dateTo;
        if (rooms) allocation.rooms = rooms;
        if (note) allocation.note = note;
        if (pk_coff) allocation.pk_coff = pk_coff;
        if (npk_coff) allocation.npk_coff = npk_coff;
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

router.get('/filteralloc/:newdate', (req, res) => {
    const [hotel, newdate, newdate2] = req.params.newdate.split("_");
    Allocation.find({
        $and: [
            { hotel: hotel },
            { dateFrom: { $lte: newdate } },
            { dateTo: { $gte: newdate2 } }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterallocR/:newdate', (req, res) => {
    const [room, newdate, newdate2] = req.params.newdate.split("_");
    Allocation.find({
        $and: [
            { 'rooms.room': room },
            { dateFrom: { $lte: newdate } },
            { dateTo: { $gte: newdate2 } }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterallocF/:newdate', (req, res) => {
    const [hotel, room, newdate, newdate2] = req.params.newdate.split("_");
    Allocation.find({
        $and: [
            { hotel: hotel },
            { 'rooms.room': room },
            { dateFrom: { $lte: newdate } },
            { dateTo: { $gte: newdate2 } }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterallocD/:newdate', (req, res) => {
    const [newdate, newdate2] = req.params.newdate.split("_");
    Allocation.find({
        $and: [
            { dateFrom: { $lte: newdate } },
            { dateTo: { $gte: newdate2 } }
        ]
    }, (error, allocfilter) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: allocfilter });
    });
});
router.get('/filterG/:groupKey', (req, res) => {
    const groupKey = req.params.groupKey;
    Allocation.find({ group: groupKey }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});
router.get('/inquirySource/:xparams', (req, res) => {
    const [datefrom, dateto, hotel, room, agent, group] = req.params.xparams.split("_");
    const _dateFrom = new Date(datefrom);
    const _dateTo = new Date(dateto);

    const one_day = 1000 * 60 * 60 * 24;
    const difference_ms = _dateFrom.getTime() - _dateTo.getTime();
    const _numOfDays = Math.round(difference_ms / one_day);

    var i;
    var _currentDate = new Date(_dateFrom);
    var _currentEndDate = new Date(_dateTo);
    for (i = 0; i < _numOfDays; i++) {

        //increment datefrom and formulate proper date for query 2018-07-01
        _currentDate.setDate(_currentDate.getDate() + 1);
        var _currentDate_format = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2)

        //get allocation details
        // var _paramAND;
        // if (hotel && room) {
        //     _paramAND = {
        //         $and: [
        //             { hotel: hotel },
        //             { 'rooms.room': room },
        //             { dateFrom: { $gte: _currentDate_format } },
        //             { dateTo: { $lte: _currentDate_format } }
        //         ]};
        // }
        // else if (hotel && !room) {
        //     _paramAND = {
        //         $and:
        //         [
        //             { hotel: hotel },
        //             { dateFrom: { $gte: _currentDate_format } },
        //             { dateTo: { $lte: _currentDate_format } }
        //         ]};
        // }
        // else if (!hotel && room) {
        //     _paramAND = {
        //         $and:
        //         [
        //             { 'rooms.room': room },
        //             { dateFrom: { $gte: _currentDate_format } },
        //             { dateTo: { $lte: _currentDate_format } }
        //         ]};
        // }
        // else {
        var _paramAND = {
            $and:
                [
                    { dateFrom: { $lte: _currentDate_format } },
                    { dateTo: { $gte: _currentDate_format } }
                ]
        };
        // }

        Allocation.find(_paramAND, (error, _allocationData) => {
            if (error) return res.json({ success: false, error });
            const _toReturnData = [];
            //enumerate result
            _allocationData.forEach(_allocationItem => {
                //get peak season
                Allocation2.find({
                    // $and: [
                    hotel: '002'
                    // {
                    //     seasondate: {
                    // 'seasondate.startValue': { $lte: _currentDate_format },
                    // 'seasondate.endValue': { $gte: _currentDate_format }
                    //     }
                    // }
                    // ]
                }, (error, _peakseasons) => {
                    if (error) return res.json({ success: false, error });

                    // Blocking.find({
                    // $and: [
                    // hotel: hotel,
                    // $and: [
                    //     {
                    //             'dateFrom': { $gte: _currentDate_format },
                    //             'dateTo': { $lte: _currentEndDate },
                    //         }
                    //     ]
                    // }, (error, _blocking) => {
                    //     if (error) return res.json({ success: false, error });
                    Availability.find({
                        // hotel: hotel,
                        $and: [
                            {
                                'availability.date': { $gte: _currentDate_format },
                                'availability.date': { $lte: _currentEndDate },
                            }
                        ]
                    }, (error, _availability) => {
                        if (error) return res.json({ success: false, error });



                        _availability.forEach(element => {
                            var _availabilityToreturn = {};
                            _availabilityToreturn.hotel = hotelname;
                            _availabilityToreturn.room = element.roomname;
                            _availabilityToreturn.statusColor = element.classColor;
                            _availabilityToreturn.status = element.status;
                            _toReturnData.push(_availabilityToreturn);
                        });

                        _allocationItem.rooms.forEach(_roomItem => {
                            var _toReturnItem = {};
                            _toReturnItem.xdate = _currentDate;
                            _toReturnItem.hotel = _allocationItem.hotelname;
                            _toReturnItem.room = _roomItem.roomname;
                            _toReturnItem.isPeakSeason = (_peakseasons.values.length > 0 ? 1 : 0);
                            _toReturnItem.pk = _roomItem.pk;
                            _toReturnItem.pk_coff = _roomItem.pk_coff;
                            _toReturnItem.npk = _roomItem.npk;
                            _toReturnItem.npk_coff = _roomItem.npk_coff;
                            _toReturnData.push(_toReturnItem);
                        });

                        // return res.json({ success: true, data: _toReturnData });
                        // });

                    });
                    //get blocking
                    //get availability
                });
                return res.json({ success: true, data: _availability });
                // return res.json({ success: true, data: _toReturnData });

            });

            //console.log(_toReturnData);
            // return res.json({ success: true, data: _toReturnData });
        });




    }


});
module.exports = router;