const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const BookingSchema = new Schema({
    reference: String,
    agent: String,
    guest:String,
    hotel: String,
    room:String,
    checkin:String,
    checkout:String,
    numrooms:Number,
    deduction:String,
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('booking', BookingSchema);