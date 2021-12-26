const axios = require('axios');

//Schema
const Identification = require('../../../models/Identification');

//Controller
let CustomerAddress = require('../../client/CustomerAddress');

//Service
const estimateTimeService = require('../../../services/ahamove/estimate-time');
const addressService = require('../../../services/ahamove/address');
const discountService = require('../../../services/discount');

async function estimateFee(req, res){
    const formData = req.body;

    const userInfo = req.jwtDecoded;
    const addressId = formData.addressId;
    const totalValue = formData.totalValue;

    calculator(res, userInfo, addressId, totalValue);
}

async function calculator(res, userInfo, addressId, totalValue){
    try {
        if(!addressId || isNaN(Math.sign(totalValue)) || Math.sign(totalValue)<0 ){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const customerAddress = await CustomerAddress.getAddressById(userInfo.data.email, addressId);
            if(!customerAddress){
                return res.status(404).json({message: 'Không tìm thấy địa chỉ này trong Sổ Địa Chỉ của khách hàng'});
            }else{
                const carotaBrandAddress = await nearestCarotaBranchAddress();
                if(!carotaBrandAddress){
                    return res.status(404).json({ message: 'Không tìm thấy địa chỉ Carota' });
                }else{
                    let carotaBrandAddressAhamoveFormat = addressService(carotaBrandAddress);
                    let customerAddressAhamoveFormat = addressService(customerAddress);
                    if(!customerAddressAhamoveFormat){
                        return res.status(422).json({ message: 'Địa của khách hàng không đúng định dạng' });
                    }else{
                        let path = `[{"address":"${carotaBrandAddressAhamoveFormat}"},{"address":"${customerAddressAhamoveFormat}"}]`
    
                        let ahamoveResult = await callAhamoveApi(path);
                        if(ahamoveResult.code === 200){
                            let shippingFee = discountService.shippingFee(totalValue, ahamoveResult.data.distance, ahamoveResult.data.total_price);

                            ahamoveResult.data = {
                                ...ahamoveResult.data,
                                shippingFee
                            }
                        }
                        return res.status(ahamoveResult.code).json(ahamoveResult.data);
                    }
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function nearestCarotaBranchAddress(){
    try {
        let identification = await Identification.model.Identification.findOne(
            {},
            { address: 1 }
        );
        if(identification){
            let addresses = identification.address;
            if(addresses && addresses.length>0){
                let index = addresses.findIndex(address=>address.isHeadquarters);
                return index >= 0 ? addresses[index] : addresses[0];
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function callAhamoveApi(path){
    try {
        let params = {
            token: process.env.AHAMOVE_API_TOKEN,
            order_time: estimateTimeService.timeUntilOrderTime(),
            path: path,
            service_id: "HAN-BIKE",
            payment_method: "CASH"
        }

        const qs = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');

        let url = decodeURI(qs);
        url = encodeURI(url);

        const option = {
            url: `/order/estimated_fee?${url}`,
            method: 'GET',
            baseURL: process.env.AHAMOVE_API_HOST
        }
        let response = await axios(option);
        let data = response.data;
        if(response.status === 200){
            data.deliveryTime = estimateTimeService.deliveryTo
        }
        return {
            code: response.status,
            data: data,
        };
    } catch (error) {
        if(error.response){
            return {
                code: error.response.status,
                data: error.response.data,
            };
        }else{
            if(error.errno === -4039){
                return {
                    code: 408,
                    data: error.response.data,
                };
            }
            return {
                code: error.response.status,
                data: error.response.data,
            };
        }
    }
}

module.exports = {
    estimateFee,
    calculator
}