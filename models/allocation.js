const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const AllocationSchema = new Schema({
    active: String,
    workspace: String,
    hotel: String,
    dateFrom: String,
    dateTo: String,
    room: [{room:String}],
    peak: [{peak:String}],
    pdays: [{pdays: String}],
    nonpeak: [{nonpeak:String}],
    nonpdays: [{nonpdays: String}],
    note: String,
    startValue: [{startValue:String}],
    endValue: [{endValue: String}]
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('allocation', AllocationSchema);