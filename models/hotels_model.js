const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const HotelsSchema = new Schema({
    hotel: String,
<<<<<<< HEAD
    hotelname: String,
    room: Array,
    created_by: String,
    updated_by: String
=======
    room:Array,
    // room1: String,
>>>>>>> 98796414e378db92b01b78470eddb4f13c562e20
    // room2: String,
    // room3: String,
    created_by: String,
    updated_by: String
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('hotel', HotelsSchema);