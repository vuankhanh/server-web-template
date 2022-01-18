const Order = require('../models/Order');
const Identification = require('../models/Identification');
const AdminAccount = require('../models/AdminAccount');

async function adminConfig(req, res){
    const configuration = {
        orderStatus: Order.orderStatus,
        orderCreatedBy: Order.orderCreatedBy,
        adminRights: AdminAccount.adminRights
    }

    const identification = await Identification.model.Identification.findOne({});
    configuration.identification = identification;
    try {
        return res.status(200).json(configuration);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function userConfig(req, res){
    let configuration = {
        orderStatus: Order.orderStatus,
        orderCreatedBy: Order.orderCreatedBy
    }

    const identification = await Identification.model.Identification.findOne({});
    configuration.identification = identification;
    try {
        return res.status(200).json(configuration);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    adminConfig,
    userConfig
};