var mongoose = require('mongoose');

var Groupschema = new mongoose.Schema({
    group: String,
});
module.exports = mongoose.model("Group", Groupschema);