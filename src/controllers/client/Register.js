const ClientAccount = require('../../models/ClientAccount'); 
const bcrypt = require('../../services/bcrypt');

async function register(req, res){
    const formData = req.body;
    formData.customerCode = 'tuthan-000001';
    try {
        formData.password = bcrypt.hashPassword(formData.password);
        const clientAccount = new ClientAccount(formData);
        await clientAccount.save();
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

module.exports = register