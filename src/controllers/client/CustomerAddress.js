const process = require('../../config/evironment');
const jwtHelper = require('../../helpers/jwt.helper');
const ClientAccount = require('../../models/ClientAccount');

// Thời gian sống của token
const accessTokenLife = process.token.authentication.ACCESS_TOKEN_LIFE;
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.token.authentication.ACCESS_TOKEN_SECRET;

async function insert(req, res){
    const formData = req.body;
    const customerInfo = req.jwtDecoded.data;

    try {
        if(formData.address){
            if(formData.address.isHeadquarters){
                await refreshDefault(customerInfo);
            }
            let accessToken = await insertAddress(customerInfo, formData.address);
            
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

async function update(req, res){
    const formData = req.body;
    const customerInfo = req.jwtDecoded.data;
    try {
        if(formData.address){
            console.log(formData.address.isHeadquarters)
            if(formData.address.isHeadquarters){
                await refreshDefault(customerInfo);
            }
            let accessToken = await updateAddress(customerInfo, formData.address);

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

async function remove(req, res){
    const formData = req.body;
    const customerInfo = req.jwtDecoded.data;
    try {
        if(formData.address){
            let accessToken = await removeAddress(customerInfo, formData.address);
            
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

async function insertAddress(customerInfo, address){
    const result = await ClientAccount.findOneAndUpdate(
        { userName: customerInfo.userName },
        { $push: {address}},
        { new: true }
    );
    if(result){
        return await jwtHelper.generateToken('client', result, accessTokenSecret, accessTokenLife);
    }return null;
}

async function updateAddress(customerInfo, newAddress){
    const result = await ClientAccount.findOneAndUpdate(
        {
            userName: customerInfo.userName,
            address: {
                $elemMatch: {_id: newAddress._id}
            }
        },
        {
            $set: {
                'address.$.responsiblePerson': newAddress.responsiblePerson,
                'address.$.phoneNumber': newAddress.phoneNumber,
                'address.$.district': newAddress.district,
                'address.$.isHeadquarters': newAddress.isHeadquarters,
                'address.$.position': newAddress.position,
                'address.$.province': newAddress.province,
                'address.$.street': newAddress.street,
                'address.$.ward': newAddress.ward,
            }
        },
        {'new': true, 'safe': true, 'upsert': true}
    );
    if(result){
        return await jwtHelper.generateToken('client', result, accessTokenSecret, accessTokenLife);
    }return null;
}

async function removeAddress(customerInfo, newAddress){
    const result = await ClientAccount.findOneAndUpdate(
        {
            userName: customerInfo.userName
        },
        {
            '$pull': {
                'address': { "_id": newAddress._id }
            }
        },
        {'new': true, 'safe': true, 'upsert': true}
    );
    if(result){
        return await jwtHelper.generateToken('client', result, accessTokenSecret, accessTokenLife);
    }return null;
}

async function refreshDefault(customerInfo){
    return await ClientAccount.findOneAndUpdate(
        {
            userName: customerInfo.userName,
            'address.isHeadquarters': true
        },
        {
            $set: {
                'address.$.isHeadquarters': false
            }
        },
        { new: true }
    );
}

module.exports = {
    insert,
    update,
    remove
};