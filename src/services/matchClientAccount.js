
const ClientAuthentication = require('../models/ClientAuthentication');
const bcrypt = require("./bcrypt");

async function checkAccount(account){
    const query = ClientAuthentication.where({ 'account.userName': account.userName });
    try {
        const result = await query.findOne().map(res=> res ? res.toObject() : res);
        if(result){
            const isRight = await bcrypt.checkCompare(account.password, result.account.password);
            if(isRight){
                return result;
            }else return null;
        }else null;
    } catch (error) {
        return error;
    }
}

async function getAccountId(email){
    try {
        const accountId = await ClientAuthentication.findOne(
            { 'email': email },
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