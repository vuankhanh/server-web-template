const ClientAuthentication = require('../../models/ClientAuthentication');

async function address(req, res){
    const customerInfo = req.jwtDecoded.data;
    try {
        const addresses = await ClientAuthentication.findOne(
            { email: customerInfo.email },
            { address: 1 }
        );
        return res.status(200).json(addresses);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const formData = req.body;
    const customerInfo = req.jwtDecoded.data;
    try {
        if(formData.address){
            if(formData.address.isHeadquarters){
                await refreshDefault(customerInfo);
            }
            const result = await ClientAuthentication.findOneAndUpdate(
                { email: customerInfo.email },
                {
                    $push: {
                        address: formData.address 
                    }
                },
                {
                    new: true,
                    select: {
                        address: 1
                    }
                }
            );
            return res.status(200).json(result);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function update(req, res){
    const formData = req.body;
    const customerInfo = req.jwtDecoded.data;
    try {
        if(formData.address){
            if(formData.address.isHeadquarters){
                await refreshDefault(customerInfo);
            }
            const result = await ClientAuthentication.findOneAndUpdate(
                {
                    email: customerInfo.email,
                    address: {
                        $elemMatch: {
                            '_id': formData.address._id
                        }
                    }
                },
                {
                    $set: {
                        'address.$.responsiblePerson': formData.address.responsiblePerson,
                        'address.$.phoneNumber': formData.address.phoneNumber,
                        'address.$.district': formData.address.district,
                        'address.$.isHeadquarters': formData.address.isHeadquarters,
                        'address.$.position': formData.address.position,
                        'address.$.province': formData.address.province,
                        'address.$.street': formData.address.street,
                        'address.$.ward': formData.address.ward,
                    }
                },
                {
                    new: true,
                    safe: true,
                    upsert: true,
                    select: {
                        address: 1
                    }
                }
            );
            return res.status(200).json(result);
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
            const result = await ClientAuthentication.findOneAndUpdate(
                {
                    email: customerInfo.email
                },
                {
                    '$pull': {
                        'address': { "_id": formData.address._id }
                    }
                },
                {
                    new: true,
                    safe: true,
                    upsert: true,
                    select: {
                        address: 1
                    }
                }
            );

            return res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function refreshDefault(customerInfo){
    return await ClientAuthentication.findOneAndUpdate(
        {
            email: customerInfo.email,
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
    address,
    insert,
    update,
    remove
};