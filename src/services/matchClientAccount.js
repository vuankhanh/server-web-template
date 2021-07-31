const ClientAccount = require('../models/ClientAccount');
const bcrypt = require("./bcrypt");

async function checkAccount(account){
    const query = ClientAccount.where({ userName: account.userName });
    try {
        const result = await query.findOne().map(res=> res ? res.toObject() : res);
        console.log(result);
        if(result){
            const isRight = await bcrypt.checkCompare(account.password, result.password);
            console.log(isRight);
            if(isRight){
                return result;
            }else return null;
        }else null;
    } catch (error) {
        return error;
    }
}

async function getAccountId(userName){
    try {
        const accountId = await ClientAccount.findOne(
            { userName: userName },
            { _id: 1 }
        );
        return accountId;
    } catch (error) {
        return error;
    }
}


module.exports = {
    checkAccount,
    getAccountId
}