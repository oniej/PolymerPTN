const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const AllocationSchema = new Schema({
    // active: Boolean,
    group: String,
    hotel: String,
    hotelname: String,
    dateFrom: String,
    dateTo: String,
    rooms: Object,
    note: String,
    pk_coff: String,
    npk_coff: String,
    high_coff: String,
    seasondate: Object,
    created_by: String,
    updated_by:String
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('allocation', AllocationSchema);