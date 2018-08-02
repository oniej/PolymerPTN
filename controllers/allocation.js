// first we import our dependencies…
const express = require('express');
const Allocation = require('../models/allocation');
const Blocking = require('../models/blocking');
const Booking = require('../models/booking');
const Availability = require('../models/availability_model');
const Hotels = require('../models/hotels_model');
// and create our instances
const router = express.Router();

router.get('/dummy', (req, res) => {
    return res.json({ success: true, data: [] });
});
router.post('/add', (req, res) => {
    const allocation = new Allocation();
    // body parser lets us use the req.body
    const { group, hotel, hotelname, dateFrom, dateTo, rooms, note, pk_coff, npk_coff, high_coff, seasondate, created_by, updated_by } = req.body;
    if (!group || !hotel || !dateFrom || !dateTo || !note) {
        return res.json({
            success: false,
            error: 'Not Found'
        });
    }
    // allocation.active = active;
    allocation.group = group;
    allocation.hotel = hotel;
    allocation.hotelname = hotelname;
    allocation.dateFrom = dateFrom;
    allocation.dateTo = dateTo;
    allocation.rooms = rooms;
    allocation.note = note;
    allocation.pk_coff = pk_coff;
    allocation.npk_coff = npk_coff;
    allocation.high_coff = high_coff;
    allocation.seasondate = seasondate;
    allocation.created_by = created_by,
        allocation.updated_by = updated_by,
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
        const { group, hotelname, dateFrom, dateTo, rooms, note, pk_coff, npk_coff, high_coff, seasondate, created_by, updated_by } = req.body;
        // allocation.active = active;
        if (group) allocation.group = group;
        // if (hotel) allocation.hotel = hotel;
        if (hotelname) allocation.hotelname = hotelname;
        if (dateFrom) allocation.dateFrom = dateFrom;
        if (dateTo) allocation.dateTo = dateTo;
        if (rooms) allocation.rooms = rooms;
        if (note) allocation.note = note;
        if (pk_coff) allocation.pk_coff = pk_coff;
        if (npk_coff) allocation.npk_coff = npk_coff;
        allocation.high_coff = high_coff;
        if (seasondate) allocation.seasondate = seasondate;
        allocation.created_by = created_by;
        allocation.updated_by = updated_by;
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

router.get('/filterG/:groupKey', (req, res) => {
    const groupKey = req.params.groupKey;
    Allocation.find({ group: groupKey }, (error, hotels) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: hotels });
    });
});
router.get('/inquirySource2/:xparams', getAvailability, getAllocation, getBlocking, getBooking, (req, res) => {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var inquiry = req.body.inquiry;

    var _dates = [];
    var xdate = new Date(datefrom);
    var _dateTo = new Date(dateto);
    while (xdate <= _dateTo) {
        _dates.push(new Date(xdate));
        xdate.setDate(xdate.getDate() + 1);
    }

    Hotels.find((err, hotels) => {
        if (err) return res.json({ success: false, error: err });

        var rawdata = [];
        var raws = [];
        hotels.forEach(hotel => {
            hotel.room.forEach(_room => {
                var _xdates = [];
                _dates.forEach(cdate => {
                    var _cdate_foravailability = new Date(cdate);
                    var _cdate_foravailability_str = _cdate_foravailability.getFullYear() + "-" + ("0" + (_cdate_foravailability.getMonth())).slice(-2) + "-" + ("0" + _cdate_foravailability.getDate()).slice(-2);
                    var _cdate_str = _cdate_foravailability.getFullYear() + "-" + ("0" + (_cdate_foravailability.getMonth() + 1)).slice(-2) + "-" + ("0" + _cdate_foravailability.getDate()).slice(-2);

                    var _x_availability = inquiry[0].filter(f => (f.date >= _cdate_foravailability_str && f.date <= _cdate_foravailability_str) && f.hotel == hotel.hotel && f.room == _room.room.split(" ").join(""));
                    var _x_allocation = inquiry[1].filter(f => (_cdate_str >= f.dateFrom && _cdate_str <= f.dateTo) && f.hotel == hotel.hotel && f.room == _room.room);
                    var _x_blocking = inquiry[2].filter(f => (_cdate_str >= f.dateFrom && _cdate_str <= f.dateTo) && f.hotel == hotel.hotel && f.room == _room.room);
                    var _x_booking = inquiry[3].filter(f => (_cdate_str >= f.checkin && _cdate_str < f.checkout) && f.hotel == hotel.hotel && f.room == _room.room);

                    var x_block = 0;
                    var x_blocking = [];
                    _x_blocking.forEach(element => {
                        x_blocking = [{
                            agent: element.agent,
                            group: element.group,
                            hotel: element.hotel,
                            hotelname: element.hotelname,
                            room: element.room,
                            roomname: element.roomname,
                            blocking: x_block += parseInt(element.block),
                            cancellation: element.cancel,
                            dateFrom: element.dateFrom,
                            dateTo: element.dateTo
                        }];
                    });

                    var x_book = [];
                    _x_booking.forEach(x_element => {
                        if (x_book.length > 0) {
                            x_book.forEach(x_ele => {
                                if (x_element.group === x_ele.group && x_element.agent === x_ele.agent && x_element.deduction === x_ele.deduction) {
                                    x_book = [{
                                        agent: x_element.agent,
                                        agentname: x_element.agentname,
                                        checkin: x_element.checkin,
                                        checkout: x_element.checkout,
                                        deduction: x_element.deduction,
                                        group: x_element.group,
                                        hotel: x_element.hotel,
                                        hotelname: x_element.hotelname,
                                        numrooms: parseInt(x_element.numrooms) + parseInt(x_ele.numrooms),
                                        room: x_element.room,
                                        roomname: x_element.roomname,
                                        updatedAt: x_element.updatedAt
                                    }];
                                }
                                else {
                                    x_book = x_ele;
                                }
                            });
                        } else {
                            x_book = _x_booking;
                        }
                    });
                    var seasondates_x = [];
                    _x_allocation.forEach(element => {
                        if (element.seasondate) {
                            element.seasondate.forEach(xx => {
                                seasondates_x.push(xx);
                            });
                        }
                    });

                    var _seasondetails = [];
                    _seasondetails = seasondates_x.filter(t => _cdate_str >= t.startValue && _cdate_str <= t.endValue);
                    _xdates.push({
                        date: cdate,
                        details: {
                            availability: _x_availability,
                            allocation: _x_allocation,
                            blocking: x_blocking,
                            booking: x_book,
                            seasondetails: _seasondetails
                        }
                    });

                });

                rawdata.push({
                    hotel: hotel.hotel,
                    hotelname: hotel.hotelname,
                    room: _room.room,
                    roomname: _room.name,
                    dates: _xdates
                });
            });
        });

        return res.json({ success: true, data: rawdata });
    });

});

function getAvailability(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAvailquery = _currentDate.getFullYear() + "-" + ("0" + _currentDate.getMonth()).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentEndDate = _endDate.getFullYear() + "-" + ("0" + _endDate.getMonth()).slice(-2) + "-" + ("0" + _endDate.getDate()).slice(-2);

    Availability.find(
        {
            $and: [
                {
                    "availability.date": { $gte: _currentDateAvailquery },
                    "availability.date": { $lte: _currentEndDate }
                }
            ]
        }, (error, _availabilityData) => {
            if (error) return res.json({ success: false, error });
            var availability = [];
            if (_availabilityData) {
                _availabilityData.forEach(element => {
                    availability = availability.concat(_removeItemFromArrayAvailability(element.hotel, element.hotelname, element.availability, element.updatedAt, _currentEndDate));
                });
            }
            if (!req.body.inquiry) { req.body.inquiry = [] };
            req.body.inquiry.push(availability);
            next();
        });
}
function getAllocation(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentendDateAllocquery = _endDate.getFullYear() + "-" + ("0" + (_endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _endDate.getDate()).slice(-2);

    Allocation.find(
        {
            // active: true,
            // group: group,
            $and: [
                {
                    $or: [
                        { dateFrom: { $gte: _currentDateAllocquery } },
                        { dateFrom: { $lte: _currentendDateAllocquery } }
                    ]
                },
                {
                    $or: [
                        { dateTo: { $gte: _currentDateAllocquery } },
                        { dateTo: { $lte: _currentendDateAllocquery } }
                    ]
                }
            ]
        }, (error, _allocationData) => {
            if (error) return res.json({ success: false, error });

            var _x_allocation = [];
            _allocationData.forEach(allocation => {
                allocation.rooms.forEach(room => {
                    _x_allocation.push({
                        group: allocation.group,
                        hotel: allocation.hotel,
                        hotelname: allocation.hotelname,
                        dateFrom: allocation.dateFrom,
                        dateTo: allocation.dateTo,
                        high_coff: allocation.high_coff,
                        npk_coff: allocation.npk_coff,
                        pk_coff: allocation.pk_coff,
                        room: room.room,
                        roomname: room.roomname,
                        high_qty: room.high,
                        npk_qty: room.npk,
                        pk_qty: room.pk,
                        seasondate: allocation.seasondate,
                        updatedAt: allocation.updatedAt
                    });
                });
            });

            req.body.inquiry.push(_x_allocation);
            next();
            // return res.json({ success: true, data: _x_allocation })

        });
}
function getBlocking(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentendDateAllocquery = _endDate.getFullYear() + "-" + ("0" + (_endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _endDate.getDate()).slice(-2);

    Blocking.find({

        group: group,
        agent: agent,
        $and: [
            {
                $or: [
                    { dateFrom: { $gte: _currentDateAllocquery } },
                    { dateFrom: { $lte: _currentendDateAllocquery } }
                ]
            },
            {
                $or: [
                    { dateTo: { $gte: _currentDateAllocquery } },
                    { dateTo: { $lte: _currentendDateAllocquery } }
                ]
            }
        ]
    }, (error, _blockingData) => {
        if (error) return res.json({ success: false, error });
        req.body.inquiry.push(_blockingData); //_uniqArray(newData);
        next();
    });
}
function getBooking(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentendDateAllocquery = _endDate.getFullYear() + "-" + ("0" + (_endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _endDate.getDate()).slice(-2);
    Booking.find({
        $and: [
            { agent: agent }
            ,
            {
                $or: [
                    { checkin: { $gte: _currentDateAllocquery } },
                    { checkin: { $lte: _currentDateAllocquery } }
                ]
            },
            {
                $or: [
                    { checkout: { $gte: _currentendDateAllocquery } },
                    { checkout: { $lte: _currentendDateAllocquery } }
                ]
            }
        ]
    }, (error, _bookingData) => {
        if (error) return res.json({ success: false, error });
        req.body.inquiry.push(_bookingData);//_uniqArray(newData);
        next();
        // return res.json({ success: true, data: _bookingData })
    });
}
function _removeItemFromArrayAvailability(hotel, hotelname, array, updatedAt, date) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        if (new Date(array[i].date) > new Date(date)) { }
        else {
            newArray.push({
                hotel: hotel,
                hotelname: hotelname,
                date: array[i].date,
                room: array[i].room,
                roomname: array[i].roomname,
                classColor: array[i].classColor,
                status: array[i].status,
                updatedAt: updatedAt

            });
        }
    }
    return newArray;
}
module.exports = router;