var nodemailer = require('nodemailer');
var config = require('../config/database');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email,
        pass: config.pass
    }
});

var mailOptions = {};
mailOptions.from = 'PTN Corp <ki4389782@gmail.com>';

module.exports.sendNewUserRegistration = function (host, email, password, cb) {
    mailOptions.to = email;
    mailOptions.subject = "Welcome to PTN Travel Corp.";
    mailOptions.text = "You had been added to PTN Corp by the PTN team.\n" +
        "Please click on the following link, or paste this into your browser to complete the registration process:\n\n" +
        "http://" + host + "/account-setup?e=" + email + "&p=" + password + "&k=" + _generateToken() + "\n\n" +
        "For your account's protection, the above link is good for single use and expires in one week.";

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) cb(error, null);
        else cb(null, info);
    });
}

module.exports.sendPasswordReset = function (host, email, token, cb) {
    mailOptions.to = email;
    mailOptions.subject = "Reset password for PTN Travel Corp.";
    mailOptions.text = "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://" + host + "/resetpwlink/" + token + "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n";
    // "An e-mail has been sent to " + user.email + " with further instructions."

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) cb(error, null);
        else cb(null, info);
    });
}

module.exports.sendPasswordChanged = function (email, cb) {
    mailOptions.to = email;
    mailOptions.subject = "Your password has been changed";
    mailOptions.text = "Hello,\n\n" +
        "This is a confirmation that the password for your account " + email + " has just been changed.\n";

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) cb(error, null);
        else cb(null, info);
    });
}

function _generateToken() {
    //reference: https://gist.github.com/mikelehen/3596a30bd69384624c11
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    var TOKEN_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    // var lastPushTime = 0;
    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    var lastRandChars = [];
    var now = new Date().getTime();
    var timeStampChars = new Array(8);

    for (var i = 7; i >= 0; i--) {
        timeStampChars[i] = TOKEN_CHARS.charAt(now % 64);
        // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
        now = Math.floor(now / 64);
    }

    if (now !== 0) throw new Error('We should have converted the entire timestamp.');

    var token = timeStampChars.join('');

    for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
    }

    for (i = 0; i < 12; i++) {
        token += TOKEN_CHARS.charAt(lastRandChars[i]);
    }

    if (token.length != 20) throw new Error('Length should be 20.');

    return token;
}