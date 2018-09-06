/* **** IMPORTS **** */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/* **** GLOBAL VARIABLES **** */
var Schema = mongoose.Schema;

/* **** BUILD SCHEMA **** */
var UserSchema = new Schema ({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

/* **** CRYPTING PASSWORD **** */
UserSchema.pre('save', function (next) {
    var newUser = this;
    bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) {
            return next (err);
        }
        newUser.password = hash;
        next();
    });
});

/* **** BUILD MODEL **** */
const UserModel = mongoose.model('user', UserSchema);

/* **** EXPORTS **** */
module.exports = UserModel;
