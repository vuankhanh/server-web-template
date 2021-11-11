const Redirect = require('../models/Redirect');

async function checkExist(urlCode){
    let condition = { strings: urlCode };
    let number = await Redirect.model.Redirect.countDocuments(condition);
    return number;
}

function randomChars(length){
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for ( let i = 0; i < length; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function generateCode(){
    
    let randomChar;
    let check; 

    while(check != 0){
        randomChar = randomChars(6);
        check = await checkExist(randomChars);
    }
    return randomChar;
}


module.exports = {
    generateCode
}