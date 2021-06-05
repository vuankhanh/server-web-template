const AdminAccount = require('../models/AdminAccount');
const bcrypt = require("./bcrypt");

async function getAccount(account){
    const query = AdminAccount.where({ userName: account.userName });
    try {
        const result = await query.findOne().map(res=> res ? res.toObject() : res);
        console.log(result);
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

module.exports = {
    getAccount
}