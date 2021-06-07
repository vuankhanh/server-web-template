const bcrypt = require('bcrypt');

function checkCompare(password, hash){
    return bcrypt.compare(password, hash)
}

function hashPassword(password){
    return bcrypt.hashSync(password, 12);
}

module.exports = {
    checkCompare,
    hashPassword
}