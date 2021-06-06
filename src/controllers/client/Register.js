const ClientAccount = require('../../models/ClientAccount'); 

async function register(req, res){
    const formData = req.body;
    formData.customerCode = 'tuthan-000001';
    try {
        const clientAccount = new ClientAccount(formData);
        await clientAccount.save();
        return res.status(200).json({ userInfo: formData, message: 'successfully' });
    } catch (error) {
        console.log('lỗi');
        console.log(error)
        return res.status(401).json({ message: 'Registration Failed' });
    }

}

module.exports = register