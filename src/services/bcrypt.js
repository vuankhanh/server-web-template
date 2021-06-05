const bcrypt = require('bcrypt');

function checkCompare(password, hash){
    return bcrypt.compare(password, hash)
}

module.exports = {
    checkCompare
}