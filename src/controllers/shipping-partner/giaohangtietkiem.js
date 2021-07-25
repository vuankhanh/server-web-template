const config = require('../../config/evironment');
const https = require('https');

const axios = require('axios');
const url = require('url');

async function chargeShipping(destination, orderInfo, options){
    try {
        let body = {
            ...destination,
            ...orderInfo,
            ...options
        };
            let addressRequest = await warehouseAddresses();
            if(addressRequest.success){
                body.pick_address_id = addressRequest.data[0].pick_address_id;
            }
            const params = new url.URLSearchParams(body);
            const option = {
                url: config.giahangtietkiem.env+'/services/shipment/fee?'+`${params}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': config.giahangtietkiem.token
                },
            }
            
            let result = await axios(option);
            return result.data;
    } catch (error) {
        console.log(error);
        console.log("lõi");
        return error;
    }
}

async function warehouseAddresses(){
    try {
        const option = {
            url: config.giahangtietkiem.env+'/services/shipment/list_pick_add',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': config.giahangtietkiem.token
            }
        }
        let result = await axios(option);
        return result.data;
    } catch (error) {
        return error;
    }
}

module.exports = {
    warehouseAddresses,
    chargeShipping
}