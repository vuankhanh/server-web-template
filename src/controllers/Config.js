const Order = require('../models/Order');
const Identification = require('../models/Identification');

async function getConfig(req, res){
    let configuration = {
        orderStatus: Order.orderStatus
    }

    const identification = await Identification.model.Identification.findOne({});
    configuration.identification = identification;
    try {
        return res.status(200).json(configuration);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = getConfig;