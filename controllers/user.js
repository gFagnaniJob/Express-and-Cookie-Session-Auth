/* **** IMPORTS **** */
var UserModel = require('../models/user');

/* **** FUNCTIONS **** */
async function checkIfUserExists(user) {
    const userFound = await UserModel.findOne({ email: user.email });
    if (userFound)
        return true;
    else
        return false;
}

module.exports = {
    checkIfUserExists
}