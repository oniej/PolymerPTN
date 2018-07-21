// first we import our dependencies…
const express = require('express');
const Allocation = require('../models/allocation');
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
    const { active, group, hotel, hotelname, dateFrom, dateTo, rooms, note, pk_coff, npk_coff, high_coff, seasondate, created_by, updated_by } = req.body;
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
        const { active, group, hotelname, dateFrom, dateTo, rooms, note, pk_coff, npk_coff, high_coff, seasondate, created_by, updated_by } = req.body;
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
router.get('/inquirySource2/:xparams', getAvailability, getAllocation, getBlocking, getBooking, (req, res) => {
    var inquiry = req.body.inquiry;
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var filterDateFrom = new Date(datefrom);
    var filterDateTo = new Date(dateto);
    var finalinquiry = [];
    inquiry.forEach(element => {
        element.availability.forEach(availability => {
            var date = new Date(availability.date);
            date.setMonth(date.getMonth() + 1);
            var returnDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
            if (date >= filterDateFrom && date <= filterDateTo) {
                availability.date = returnDate;
                finalinquiry.push(availability);
            }
        });
    });
    res.json({ success: true, data: finalinquiry });
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
                    availability.push({
                        hotel: element.hotelname,
                        availability: _removeItemFromArray(element.availability, _currentEndDate)
                    });
                    // if (availability.length > 0) {
                    //     availability.forEach(avail => {
                    //         // console.log(element);
                    //         if (avail.hotelname === element.hotelname) {
                    //             avail.availability = avail.availability.concat(_removeItemFromArray(element.availability, _currentEndDate));
                    //         }
                    //         else {
                    //             availability.push({
                    //                 hotel: element.hotelname,
                    //                 availability: _removeItemFromArray(element.availability, _currentEndDate)
                    //             });
                    //         }
                    //     });
                    // }
                    // else {
                    //     availability.push({
                    //         hotel: element.hotelname,
                    //         availability: _removeItemFromArray(element.availability, _currentEndDate)
                    //     });
                    // }
                });
            }

            req.body.inquiry = availability;
            next();
            // return res.json({ success: true, data: _availabilityData })
        });
}
function getAllocation(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var _currentendDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);

    var availability = req.body.inquiry;
    Allocation.find(
        {
            active: true,
            group: group,
            $or: [
                { dateFrom: { $lte: _currentDateAllocquery } },
                { dateFrom: { $gte: _currentDateAllocquery } }
            ]
        }, (error, _allocationData) => {
            if (error) return res.json({ success: false, error });
            var newData = [];
            if (_allocationData) {
                _allocationData.forEach(allocation => {
                    if (availability.length > 0) {
                        availability.forEach(avail => {
                            avail.group = allocation.group;
                            if (allocation.hotelname === avail.hotel) {
                                avail.availability.forEach(availMin => {
                                    var availDate = new Date(availMin.date);
                                    availDate.setMonth(availDate.getMonth() + 1);
                                    if (availDate >= new Date(allocation.dateFrom) && availDate <= new Date(allocation.dateTo)) {
                                        if (allocation.seasondate.length > 0) {
                                            allocation.seasondate.forEach(peakalloc => {
                                                allocation.rooms.forEach(allocationRoom => {
                                                    if (new Date(availDate) >= new Date(peakalloc.startValue) && new Date(availDate) <= new Date(peakalloc.endValue)) {
                                                        availMin.peakStart = peakalloc.startValue;
                                                        availMin.peakEnd = peakalloc.endValue;
                                                        availMin.isPeak = true;
                                                        availMin.season = peakalloc.season;
                                                        var remove = allocationRoom.roomname.split(" ").join("");
                                                        if (remove === availMin.roomname) {
                                                            availMin.peakAmount = allocationRoom.pk;
                                                            availMin.pcutoff = allocation.pk_coff;
                                                        }
                                                    }
                                                    else {
                                                        var remove = allocationRoom.roomname.split(" ").join("");
                                                        if (remove === availMin.roomname) {
                                                            availMin.npeakAmount = allocationRoom.npk;
                                                            availMin.npcutoff = allocation.npk_coff;
                                                        }
                                                    }
                                                });
                                            });
                                        } else {
                                            allocation.rooms.forEach(allocationRoomspace => {
                                                var removeSpace = allocationRoomspace.roomname.split(" ").join("");
                                                if (removeSpace === availMin.roomname) {
                                                    availMin.npeakAmount = allocationRoomspace.npk;
                                                    availMin.npcutoff = allocationRoomspace.npk_coff;
                                                }
                                            });
                                        }
                                        availMin.hotel = allocation.hotelname;
                                        availMin.group = allocation.group;
                                        newData.push(avail);
                                    }
                                    else {
                                        newData.push(avail);
                                    }
                                });
                            } else {
                                newData.push(avail);
                            }
                        });
                    }
                    else {
                        newData.push(allocation);
                    }
                });
            }
            else {
                newData = availability;
            }

            req.body.inquiry = _uniqArray(newData);
            next();
            // console.log(_allocationData);
            // return res.json({ success: true, data: _uniqArray(newData) });
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
        ],
        $or: [
            { "rooms.dateFrom": { $gte: _currentDateAllocquery } },
            { "rooms.dateTo": { $lte: _currentendDateAllocquery } }
        ]
    }, (error, _blockingData) => {
        if (error) return res.json({ success: false, error });
        var newData = [];
        if (_blockingData) {
            _blockingData.forEach(block => {
                // if (block.group === group && block.agent === agent) {
                availability.forEach(availeach => {
                    if (block.group === availeach.group) {
                        if (block.hotelname === availeach.hotel) {
                            availeach.availability.forEach(availdate => {
                                var availDate = new Date(availdate.date);
                                availDate.setMonth(availDate.getMonth() + 1);
                                block.rooms.forEach(blockdata => {
                                    if (new Date(availDate) >= new Date(blockdata.dateFrom) && new Date(availDate) <= new Date(blockdata.dateTo)) {
                                        if (blockdata.roomname === availdate.roomname) {
                                            availdate.blocking = blockdata.block;
                                            availdate.cancellation = blockdata.cancel;
                                            availdate.blockstart = blockdata.dateFrom;
                                            availdate.blockend = blockdata.dateTo;
                                            availdate.agent = block.agent;
                                        }
                                        newData.push(availeach);
                                    }
                                    else {
                                        if (blockdata.roomname === availdate.roomname) {
                                            availdate.blocking = blockdata.block;
                                            availdate.cancellation = blockdata.cancel;
                                            availdate.blockstart = blockdata.dateFrom;
                                            availdate.blockend = blockdata.dateTo;
                                            availdate.agent = block.agent;
                                        }
                                        newData.push(availeach);
                                    }
                                });

                            });
                        }
                        //  else {
                        //     newData.push(availability);
                        // }
                    }
                })
                // }
            });
        } else {
            newData = availability;
        }
        req.body.inquiry = _uniqArray(newData);
        next();
    });
}
function getBooking(req, res, next) {
    const [datefrom, dateto, group, agent, hotel, room] = req.params.xparams.split("_");
    var _currentDate = new Date(datefrom);
    var _endDate = new Date(dateto);
    var _currentDateAllocquery = _currentDate.getFullYear() + "-" + ("0" + (_currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + _currentDate.getDate()).slice(-2);
    var availability = req.body.inquiry;
    Booking.find({
        $and: [
            { agent: agent }
        ],
        $or: [
            { checkin: { $gte: _currentDateAllocquery } },
            { checkout: { $lt: _currentDateAllocquery } }
        ]
    }, (error, _bookingData) => {
        if (error) return res.json({ success: false, error });
        if (_bookingData.length == 0) {
            req.body.inquiry = availability;
            next();
        }
        var newData = [];
        _bookingData.forEach(book => {
            availability.forEach(availbook => {
                availbook.availability.forEach(availdeduct => {
                    if (availbook.hotel === book.hotel) {
                        if (book.deduction === "Blocking") {
                            if (availdeduct.roomname === book.room) {
                                availdeduct.block = parseInt(availdeduct.blocking) - book.numrooms;
                            }
                            newData.push(availbook);
                        } else {
                            if (availdeduct.isPeak) {
                                availdeduct.block = parseInt(availdeduct.peakAmount) - book.numrooms;
                            } else {
                                availdeduct.block = parseInt(availdeduct.npeakAmount) - book.numrooms;
                            }
                            newData.push(availbook);
                        }
                    } else {
                        newData.push(availbook);
                    }
                });
            })
        });
        req.body.inquiry = _uniqArray(newData);
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
module.exports = router;