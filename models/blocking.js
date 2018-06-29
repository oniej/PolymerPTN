const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const BlockingSchema = new Schema({
    active: Boolean,
    group: String,
    hotel: String,
    dateFrom: String,
    dateTo: String,
    rooms: Object,
    note: String,
    seasondate: Object
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('blocking', BlockingSchema);