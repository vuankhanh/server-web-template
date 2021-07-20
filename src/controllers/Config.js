const config = require('../config/evironment');

async function getConfig(req, res){
    let configuration = {
        orderStatus: config.order.orderStatus
    }
    try {
        return res.status(200).json(configuration);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = getConfig;