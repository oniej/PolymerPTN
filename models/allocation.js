const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const AllocationSchema = new Schema({
    hotel: String,
    dateFrom: String,
    dateTo: String,
    room: String,
    peak: String,
    pdays: String,
    nonpeak: String,
    nonpdays: String,
    note: String,
    startValue: String,
    endValue: String
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('allocation', AllocationSchema);