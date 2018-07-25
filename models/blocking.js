const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const BlockingSchema = new Schema({
    // active: Boolean,
    agent: String,
    group: String,
    hotel: String,
    hotelname: String,
    // dateFrom: String,
    // dateTo: String,
    // rooms: Object,
    room: String,
    roomname: String,
    dateFrom: String,
    dateTo: String,
    block: String,
    cancel: String,
    
    note: String,
    created_by: String,
    updated_by:String
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('blocking', BlockingSchema);