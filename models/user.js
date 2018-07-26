var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountkey: {
        type: String,
        required: true
    },
    isActive: Boolean,
    isEmailVerified: Boolean,
    group: String,
    role: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function (id, cb) {
    User.findById(id, cb);
}

module.exports.getUserByEmail = function (email, cb) {
    User.findOne({ email: email }, cb);
}

module.exports.getUserByAccountkey = function (accountkey, cb) {
    User.findOne({ accountkey: accountkey }, cb);
}

module.exports.saveUser = function (newUser, cb) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(cb);
        });
    });
}

module.exports.comparePassword = function (myPassword, hash, cb) {
    bcrypt.compare(myPassword, hash, function (err, isMatch) {
        if (err) throw err;
        cb(null, isMatch);
    });
}

