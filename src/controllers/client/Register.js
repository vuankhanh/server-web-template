const crypto = require('crypto');
const ClientAccount = require('../../models/ClientAccount');
const VerificationEmail = require('./VerificationEmail');
const bcrypt = require('../../services/bcrypt');

async function register(req, res){
    const formData = req.body;
    formData.customerCode = 'tuthan-000001';
    formData.emailToken = crypto.randomBytes(64).toString('hex');
    try {
        formData.password = bcrypt.hashPassword(formData.password);
        const clientAccount = new ClientAccount(formData);
        await clientAccount.save();
        let userInfo = { 
            userId: clientAccount._id,
            userName: clientAccount.userName,
            name: clientAccount.name,
            email: clientAccount.email,
            emailToken: clientAccount.emailToken
        };
        let result = await VerificationEmail.verificationEmail(userInfo);
        return res.status(200).json({ message: 'successfully' });
    } catch (error) {
        if(error.code===11000){
            if(error.keyPattern){
                return res.status(409).json({ key: error.keyPattern, message: 'Registration Failed' });
            }
        }else{
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function verifyEmail(req, res){
    const query = req.query;
    try {
        if(!query.userId || !query.emailToken){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let condition = {
                _id: query.userId,
                emailToken: query.emailToken
            }
            const user = await ClientAccount.findOne(condition);
            if(!user){
                return res.status(404).json({message: 'token is invalid'});
            }else{
                const updateUser = await ClientAccount.findOneAndUpdate(
                    condition,
                    {
                        $set: {
                            'emailToken': null,
                            'isVerified': true
                        }
                    },
                    { new: true }
                );
                return res.status(200).json({message: 'success'});
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    register,
    verifyEmail
}