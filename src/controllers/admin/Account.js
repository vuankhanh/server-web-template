const bcryptService = require('../../services/bcrypt');
const AdminAccount = require('../../models/AdminAccount');

const matchAdminAccountService = require('../../services/matchAdminAccount');

async function changePassword(req, res){
    const jwtDecoded = req.jwtDecoded;
    const accountInfo = jwtDecoded.data;
    if(accountInfo.permission != 1){
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'Unable to access this route.',
        });
    }else{
        const formData = req.body;
        console.log(formData);
        if(!formData.oldPassword || !formData.password){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let checkPassword = checkPasswordValid(formData.password);
            if(!checkPassword){
                return res.status(400).json({ message: 'Password is invalid' });
            }else{
                const account = {
                    userName: accountInfo.userName,
                    password: formData.oldPassword
                }
        
                let matchedAccount = await matchAdminAccountService.getAccount(account);
                if(matchedAccount){
                    const dataWillUpdate = {
                        password: bcryptService.hashPassword(formData.password)
                    }
                    const result = await AdminAccount.model.AdminAccount.findOneAndUpdate(
                        { email: accountInfo.email },
                        { $set: dataWillUpdate},
                        { new: true }
                    );
        
                    console.log(result);
                    return res.status(200).json({ message: 'successfully' });
                }else{
                    return res.status(400).json({ message: 'Password is incorrect' });
                }
            }
        }
    }
}

function checkPasswordValid(password){
    if(!password){
        return false;
    }else{
        const hasUpperCase = /[A-Z]+/.test(password);
    
        const hasLowerCase = /[a-z]+/.test(password);
    
        const hasNumeric = /[0-9]+/.test(password);
    
        const length = password.length>=6;
    
        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && length;

        return passwordValid;
    }
}

module.exports = {
    changePassword,
}