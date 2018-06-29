var mongoose = require('mongoose');
var Userschema = new mongoose.Schema({
    email: String,
    password: String
});
module.exports = mongoose.model("User", Userschema);