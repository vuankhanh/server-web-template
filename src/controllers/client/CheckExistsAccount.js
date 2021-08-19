const ClientAuthentication = require('../../models/ClientAuthentication');

async function checkExistsUserName(req, res){
    const formData = req.body;
    if(!formData.userName) return res.status(401).json({ message: 'userName field is not found' });
    const query = ClientAuthentication.where({ 'account.userName': formData.userName });
    try {
        const result = await query.findOne().map(res=> res ? res.toObject() : res);
        if(result){
            return res.status(409).json({ message: 'This User Name already exists' });
        }else{
            return res.status(200).json({ message: 'This User Name is available' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function checkExistsEmail(req, res){
    const formData = req.body;
    if(!formData.email) return res.status(401).json({ message: 'userName field is not found' });
    const query = ClientAuthentication.where({ email: formData.email });
    try {
        const result = await query.findOne().map(res=> res ? res.toObject() : res);
        if(result){
            return res.status(409).json({ message: 'This Email already exists' });
        }else{
            return res.status(200).json({ message: 'This Email is available' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    checkExistsUserName,
    checkExistsEmail
}