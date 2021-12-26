const AutoIncrementCodeGenerator = require('../models/AutoIncrementCodeGenerator');

async function getNextSequence(codeType){
    if(codeType === 'userCode' || codeType === 'productCode' || codeType === 'orderCode'){
        try {
            let conditional = {};
            conditional[codeType] = 1;
            let result = await AutoIncrementCodeGenerator.model.AutoIncrementCodeGenerator.findOneAndUpdate(
                {},
                { $inc: conditional },
                {
                    new: true,
                    select: conditional
                }
            );
            return result;
        } catch (error) {
            return error
        }
    }else{
        return null;
    }
}

function padWithZero(number){
    let myString = number.toString();
    while (myString.length <= 9) {
        myString = '0' + myString;
    }
    return myString;
}

module.exports = {
    getNextSequence,
    padWithZero
}