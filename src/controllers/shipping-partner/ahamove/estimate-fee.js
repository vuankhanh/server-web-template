const config = require('../../../config/evironment');
const axios = require('axios');
const qs = require('qs');

//Schema
const Identification = require('../../../models/Identification');

//Service
const estimateTimeService = require('../../../services/ahamove/estimate-time');
const addressService = require('../../../services/ahamove/address');

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



async function estimateFee(req, res){
    const formData = req.body;
    const customerAddress = formData.customerAddress;
    const carotaBrandAddress = await nearestCarotaBranchAddress();

    try {
        if(!customerAddress){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
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
                    return res.status(200).json(ahamoveResult);
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function callAhamoveApi(path){
    try {
        let params = {
            token: config.ahamove.token,
            order_time: estimateTimeService.timeUntilOrderTime(),
            path: path,
            service_id: "HAN-BIKE",
            payment_method: "CASH"
        }

        // console.log(Object.keys(params)
        // .map(key => `${key}=${params[key]}`)
        // .join('&'));

        const qs = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');

        let url = decodeURI(qs);
        url = encodeURI(url);

        console.log(`/order/estimated_fee?${qs}`);
        const option = {
            url: `/order/estimated_fee?${url}`,
            method: 'GET',
            baseURL: config.ahamove.env
        }
        let result = await axios(option);
        return result.data;
    } catch (error) {
        if(error.response){
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }else{
            console.log(error);
        }
        return null;
    }
    
}

module.exports = {
    estimateFee
}