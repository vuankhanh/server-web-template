const giaohangtietkiem = require('../shipping-partner/giaohangtietkiem');

async function astimateShippingFee(req, res){
    let formData = req.body;
    try {
        if(!formData.destination || !formData.orderInfo){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let destination = {
                street: formData.destination.street,
                ward: formData.destination.ward.name,
                district: formData.destination.district.name,
                province: formData.destination.province.name
            }
        
            let orderInfo = {
                weight: formData.orderInfo.weight,
                value: formData.orderInfo.totalValue
            }
        
            let option = {
                transport: "road",
                deliver_option: "xteam"
            }
        
            let chargeShipping = await giaohangtietkiem.chargeShipping(destination, orderInfo, option);
            return res.status(200).json(chargeShipping.fee);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    astimateShippingFee
}