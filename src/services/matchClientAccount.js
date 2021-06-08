const ClientAccount = require('../models/ClientAccount');
const bcrypt = require("./bcrypt");

async function getAccount(account){
    const query = ClientAccount.where({ userName: account.userName });
    try {
        const result = await query.findOne().map(res=> res ? res.toObject() : res);
        if(result){
            const isRight = await bcrypt.checkCompare(account.password, result.password);
            if(isRight){
                return result;
            }else return null;
        }else null;
    } catch (error) {
        return error;
    }
}

module.exports = getAccount