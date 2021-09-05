const crypto = require('crypto');
const ClientAuthentication = require('../../models/ClientAuthentication');
const VerificationEmail = require('./VerificationEmail');
const bcrypt = require('../../services/bcrypt');

async function register(req, res){
    const formData = req.body;
    try {
        let object = {
            customerCode: 'tuthan-000001',
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            name: formData.name,
            allowAccount: true,
            account: {
                userName: formData.userName,
                password: bcrypt.hashPassword(formData.password),
                emailToken: crypto.randomBytes(64).toString('hex')
            },
        }
        const authenticationResult = await ClientAuthentication.findOne({ email: object.email });
        if(authenticationResult){
            if(authenticationResult.account && authenticationResult.account.userName){
                return res.status(409).json({ message: 'Email and UserName already exists' });
            }else{
                const updateAuthentication = await ClientAuthentication.findOneAndUpdate(
                    { email: object.email },
                    {
                        phoneNumber: formData.phoneNumber,
                        name: formData.name,
                        allowAccount: true,
                        account: {
                            userName: formData.userName,
                            password: bcrypt.hashPassword(formData.password),
                            emailToken: crypto.randomBytes(64).toString('hex')
                        }
                    },
                    { new: true }
                );

                let userInfo = { 
                    userId: updateAuthentication._id,
                    name: updateAuthentication.name,
                    email: updateAuthentication.email,
                    userName: updateAuthentication.account.userName,
                    emailToken: updateAuthentication.account.emailToken
                };

                let result = await VerificationEmail.verificationEmail(userInfo);
                return res.status(200).json({ message: 'successfully' });
            }
        }else{
            const authentication = new ClientAuthentication(object);
            await authentication.save();
            let userInfo = { 
                userId: authentication._id,
                name: authentication.name,
                email: authentication.email,
                userName: authentication.account.userName,
                emailToken: authentication.account.emailToken
            };
            let result = await VerificationEmail.verificationEmail(userInfo);
            return res.status(200).json({ message: 'successfully' });
        }
    } catch (error) {
        if(error.code===11000){
            if(error.keyPattern['account.userName'] === 1){
                return res.status(409).json({ message: 'UserName already exists' });
            }
            return res.status(409).json({ message: 'Registration Failed' });
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
                'account.emailToken': query.emailToken
            }
            const user = await ClientAuthentication.findOne(condition);
            if(!user){
                return res.status(404).json({message: 'token is invalid'});
            }else{
                await ClientAuthentication.findOneAndUpdate(
                    condition,
                    {
                        $set: {
                            'account.emailToken': null,
                            'account.isVerified': true
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