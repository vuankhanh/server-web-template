const process = require('../../config/evironment');
const jwtHelper = require('../../helpers/jwt.helper');
const ClientAccount = require('../../models/ClientAccount');
const matchClientAccount = require('../../services/matchClientAccount');
const bcrypt = require("../../services/bcrypt");

// Thời gian sống của token
const accessTokenLife = process.token.authentication.ACCESS_TOKEN_LIFE;
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.token.authentication.ACCESS_TOKEN_SECRET;

async function update(req, res){
    const formData = req.body;
    const customerInfo = req.jwtDecoded.data;
    try {
        if(formData.oldPassword){
            customerInfo.password = formData.oldPassword;
            let matchedAccount = await matchClientAccount.checkAccount(customerInfo);
            if(matchedAccount){
                formData.password = bcrypt.hashPassword(formData.password);
                let accessToken = await findOneAndUpdateAndGenNewtoken(customerInfo, formData);
                if(accessToken){
                    return res.status(200).json({ message: 'successfully', accessToken: accessToken });
                }else{
                    return res.status(204).json({ message: 'Nothing changes' });
                }
            }else{
                return res.status(400).json({ message: 'Password is incorrect' });
            }
        }else{
            let accessToken = await findOneAndUpdateAndGenNewtoken(customerInfo, formData);
            if(accessToken){
                return res.status(200).json({ message: 'successfully', accessToken: accessToken });
            }else{
                return res.status(204).json({ message: 'Nothing changes' });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function findOneAndUpdateAndGenNewtoken(customerInfo, dataWillUpdate){
    const result = await ClientAccount.findOneAndUpdate(
        { userName: customerInfo.userName },
        { $set: dataWillUpdate},
        { new: true }
    );
    if(result){
        return await jwtHelper.generateToken('client', result, accessTokenSecret, accessTokenLife);
    }return null;
}

module.exports = update;