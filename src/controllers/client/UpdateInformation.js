const ClientAccount = require('../../models/ClientAccount');
const matchClientAccount = require('../../services/matchClientAccount');
const bcrypt = require("../../services/bcrypt");

async function update(req, res){
    const formData = req.body;
    const customerInfo = req.jwtDecoded.data;
    try {
        if(formData.oldPassword){
            customerInfo.password = formData.oldPassword;
            console.log(formData);
            let matchedAccount = await matchClientAccount(customerInfo);
            console.log(matchedAccount);
            if(matchedAccount){
                formData.password = bcrypt.hashPassword(formData.password);
                const updateDocument = await ClientAccount.updateOne({ userName: customerInfo.userName }, formData);
                return res.status(200).json({ message: 'successfully', data: updateDocument });
            }else{
                return res.status(400).json({ message: 'Password is incorrect' });
            }
        }else{
            const updateDocument = await ClientAccount.updateOne({ userName: customerInfo.userName }, formData);
            return res.status(200).json({ message: 'successfully', data: updateDocument });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = update;