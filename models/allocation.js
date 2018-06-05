const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const AllocationSchema = new Schema({
    hotel: String,
    dateFrom: String,
    dateTo: String,
   
    room: [{
        room: {type: String},
        // room1: {type: String}
    }],
    peak: String,
    // peak:  [{
    //     peak1: {type: String},
    // }],
    pdays: String,
    // pdays:  [{
    //     cutoff: {type: String},
    // }],
    nonpeak: String,
    // nonpeak:  [{
    //    nonpeak1: {type: String},
    // }],
    nonpdays: String,   
    // nonpdays:  [{
    //     nonpeakday: {type: String},
    // }],
    note: String,
    startValue: String,
    endValue: String
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('allocation', AllocationSchema);