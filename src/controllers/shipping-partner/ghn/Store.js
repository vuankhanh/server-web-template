const config = require('../../../config/evironment');

const axios = require('axios');

let token = config.ghn.token;
let host = config.ghn.env;

async function getNearestStore(phone){
    const option = {
        url: host+'/shiip/public-api/v2/shop/all',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    }

    let response = await axios(option);
    if(response.data){
        let result = response.data;
        if(result && result.code === 200){
            let ghnShops = result.data.shops;
            let index = ghnShops.findIndex(shop=>shop.phone === phone);
            return index >=0 ? ghnShops[index] : false;
        }
    }
    return false;
}

module.exports = {
    getNearestStore
}