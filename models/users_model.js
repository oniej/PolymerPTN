const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const UsersSchema = new Schema({
    account_key: String,
    fullname: String,
    email: String,
    // password: String,
    account_type: String,
    group: String,
    active: Boolean,
    // created_date: String,
}, { timestamps: true });
// export our module to use in server.js
module.exports = mongoose.model('user_data', UsersSchema);