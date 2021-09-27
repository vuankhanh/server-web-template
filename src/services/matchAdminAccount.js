const AdminAccount = require('../models/AdminAccount');
const bcrypt = require("./bcrypt");

async function getAccount(account){
    const query = AdminAccount.where({ userName: account.userName });
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


async function getAccountId(account){
    try {
        const accountId = await AdminAccount.findOne(
            { userName: account.userName },
            { _id: 1 }
        );
        return accountId;
    } catch (error) {
        return error;
    }
}

module.exports = {
    getAccount,
    getAccountId
}