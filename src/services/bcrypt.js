const bcrypt = require('bcrypt');

function checkCompare(password, hash){
    return bcrypt.compare(password, hash)
}

function hashPassword(password){
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
}

module.exports = {
    checkCompare,
    hashPassword
}