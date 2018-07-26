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
        hotels.forEach(hotel => {
            hotel.room.forEach(_room => {
                var _xdates = [];
                _dates.forEach(cdate => {
                    var _cdate_foravailability = new Date(cdate);
                    var _cdate_foravailability_str = _cdate_foravailability.getFullYear() + "-" + ("0" + (_cdate_foravailability.getMonth())).slice(-2) + "-" + ("0" + _cdate_foravailability.getDate()).slice(-2);
                    var _cdate_str = _cdate_foravailability.getFullYear() + "-" + ("0" + (_cdate_foravailability.getMonth() + 1)).slice(-2) + "-" + ("0" + _cdate_foravailability.getDate()).slice(-2);

                    var _x_availability = inquiry[0].filter(f => (f.date >= _cdate_foravailability_str && f.date <= _cdate_foravailability_str) && f.hotel == hotel.hotel && f.room == _room.room);
                    var _x_allocation = inquiry[1].filter(f => (_cdate_str >= f.dateFrom && _cdate_str <= f.dateTo) && f.hotel == hotel.hotel && f.room == _room.room);
                    var _x_blocking = inquiry[2].filter(f => (_cdate_str >= f.dateFrom && _cdate_str <= f.dateTo) && f.hotel == hotel.hotel && f.room == _room.room);
                    var _x_booking = inquiry[3].filter(f => (_cdate_str >= f.checkin && _cdate_str < f.checkout) && f.hotel == hotel.hotel && f.room == _room.room);

                    var seasondates_x = [];
                    _x_allocation.forEach(element => {
                        if(element.seasondate)
                        {
                            element.seasondate.forEach(xx => {
                                seasondates_x.push(xx);
                            });
                        }
                        
                    });

                    var _seasondetails = [];
                    _seasondetails = seasondates_x.filter(t=>_cdate_str >= t.startValue && _cdate_str <= t.endValue);
    

                    _xdates.push({
                        date: cdate,
                        details: {
                            availability: _x_availability,
                            allocation: _x_allocation,
                            blocking: _x_blocking,
                            booking: _x_booking,
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

        res.json({ success: true, data: rawdata });
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
                    availability = availability.concat(_removeItemFromArrayAvailability(element.hotel, element.hotelname, element.availability, _currentEndDate));
                });
            }
            if (!req.body.inquiry) { req.body.inquiry = [] };

            // var _availability_out = [];
            // availability.forEach(element => {
            //     element.forEach(element_dates => {

            //     });
            // });



            req.body.inquiry.push(availability);
            next();
            // return res.json({ success: true, data: _availabilityData })
        });
}
function getAllocation(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentendDateAllocquery = _endDate.getFullYear() + "-" + ("0" + (_endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _endDate.getDate()).slice(-2);

    var availability = req.body.inquiry;
    Allocation.find(
        {
            active: true,
            group: group,
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
                        seasondate: allocation.seasondate

                    });
                });
            });

            req.body.inquiry.push(_x_allocation);
            next();

            // return res.json({ success: true, data: _x_allocation });
        });
}
function getBlocking(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentendDateAllocquery = _endDate.getFullYear() + "-" + ("0" + (_endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _endDate.getDate()).slice(-2);

    var availability = req.body.inquiry;
    Blocking.find({
        $and: [
            { group: group },
            { agent: agent },
            { dateFrom: { $gte: _currentDateAllocquery } },
            { dateTo: { $lte: _currentendDateAllocquery } }
        ]
    }, (error, _blockingData) => {
        if (error) return res.json({ success: false, error });


        // var newData = [];
        // if (_blockingData) {
        //     _blockingData.forEach(block => {
        //         availability.forEach(availeach => {
        //             if (block.group === availeach.group) {
        //                 if (block.hotelname === availeach.hotel) {
        //                     availeach.availability.forEach(availdate => {
        //                         var availDate = new Date(availdate.date);
        //                         availDate.setMonth(availDate.getMonth() + 1);
        //                         block.rooms.forEach(blockdata => {
        //                             if (new Date(availDate) >= new Date(blockdata.dateFrom) && new Date(availDate) <= new Date(blockdata.dateTo)) {
        //                                 if (blockdata.roomname === availdate.roomname) {
        //                                     availdate.blocking = blockdata.block;
        //                                     availdate.cancellation = blockdata.cancel;
        //                                     availdate.blockstart = blockdata.dateFrom;
        //                                     availdate.blockend = blockdata.dateTo;
        //                                     availdate.agent = block.agent;
        //                                 }
        //                                 newData.push(availeach);
        //                             }
        //                             else {
        //                                 if (blockdata.roomname === availdate.roomname) {
        //                                     availdate.blocking = blockdata.block;
        //                                     availdate.cancellation = blockdata.cancel;
        //                                     availdate.blockstart = blockdata.dateFrom;
        //                                     availdate.blockend = blockdata.dateTo;
        //                                     availdate.agent = block.agent;
        //                                 }
        //                                 newData.push(availeach);
        //                             }
        //                         });

        //                     });
        //                 }
        //             }
        //         })
        //     });
        // }
        // newData = availability;

        req.body.inquiry.push(_blockingData); //_uniqArray(newData);
        next();
        // return res.json({ success: true, data: _blockingData });
    });
}
function getBooking(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentendDateAllocquery = _endDate.getFullYear() + "-" + ("0" + (_endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _endDate.getDate()).slice(-2);

    var availability = req.body.inquiry;
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
        // if (_bookingData.length == 0) {
        //     req.body.inquiry = availability;
        //     next();
        // }
        // var newData = [];
        // _bookingData.forEach(book => {
        //     availability.forEach(availbook => {
        //         availbook.availability.forEach(availdeduct => {
        //             if (availbook.hotel === book.hotel) {
        //                 if (book.deduction === "Blocking") {
        //                     if (availdeduct.roomname === book.room) {
        //                         availdeduct.block = parseInt(availdeduct.blocking) - book.numrooms;
        //                     }
        //                     newData.push(availbook);
        //                 } else {
        //                     if (availdeduct.isPeak) {
        //                         availdeduct.block = parseInt(availdeduct.peakAmount) - book.numrooms;
        //                     } else {
        //                         availdeduct.block = parseInt(availdeduct.npeakAmount) - book.numrooms;
        //                     }
        //                     newData.push(availbook);
        //                 }
        //             } else {
        //                 newData.push(availbook);
        //             }
        //         });
        //     })
        // });
        req.body.inquiry.push(_bookingData);//_uniqArray(newData);
        next();
    });
}
function _uniqArray(array) {
    array = array.filter((array, index, self) =>
        index === self.findIndex((data) => (
            data.hotel === array.hotel
        ))
    );
    return array;
}
function _removeItemFromArray(array, date) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        if (new Date(array[i].date) > new Date(date)) { }
        else {
            newArray.push(array[i]);
        }
    }
    return newArray;
}
function _removeItemFromArrayAvailability(hotel, hotelname, array, date) {
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
                status: array[i].status

            });
        }
    }
    return newArray;
}
module.exports = router;