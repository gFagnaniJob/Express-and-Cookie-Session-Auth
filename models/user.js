/* **** IMPORTS **** */
const mongoose = require('mongoose');

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

/* **** BUILD MODEL **** */
const UserModel = mongoose.model('user', UserSchema);

/* **** EXPORTS **** */
module.exports = UserModel;
