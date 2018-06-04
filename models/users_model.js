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
var User = module.exports = mongoose.model('user_data', UsersSchema);
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
    module.exports.getUserByEmail = function (email, callback) {
        var query = { email: email };
        User.findOne(query, callback);
    }
}
// module.exports.createUser = function (newUser, callback) {
//     bcrypt.gensalt(10, function (err, salt) {
//         bcrypt.hash(newUser, salt, function (err, hash) {
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     });
// }
