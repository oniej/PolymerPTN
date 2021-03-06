const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const AvailabilitySchema = new Schema({
    hotel: String,
    created_by: String,
    updated_by: String,
    notes: String
    // room2: String,
    // room3: String,
    // room4: String,
    // room5: String,
    // created_date: String,
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('availability', AvailabilitySchema);