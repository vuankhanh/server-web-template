const axios = require('axios');

const config = require('../../../config/evironment');
const ghnStore = require('./Store');
const ghnAddress = require('./Address');


let token = config.ghn.token;
let host = config.ghn.env;

async function getAvailableService(carotaAddress, headquartersPhone){
    let ghnShops = await ghnStore.getNearestStore(headquartersPhone);
    let ghnProvinceId = await ghnAddress.getProvinceId(carotaAddress.province.name);
    if(ghnProvinceId && ghnShops){
        let ghnDistrictId = await ghnAddress.getDistrictId(carotaAddress.district.name, ghnProvinceId);

        const option = {
            url: host+'/shiip/public-api/v2/shipping-order/available-services',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            params: {
                shop_id: ghnShops._id,
                from_district: ghnShops.district_id,
                to_district: ghnDistrictId
            }
        }
        let response = await axios(option);
        if(response.data){
            let result = response.data;
            if(result && result.code === 200){
                let availableServices = result.data;
                return availableServices.filter(service=>service.short_name);
            }
        }
    }
    return false;
}

let address = {
    "province": {
        "name": "Thành phố Hà Nội",
        "code": "01"
    },
    "district": {
        "provinceCode": "01",
        "name": "Quận Hoàn Kiếm",
        "code": "002"
    },
    "ward": {
        "districtCode": "002",
        "name": "Phường Đồng Xuân",
        "code": "00040",
        "type": "Phường"
    },
}

// getAvailableService(address, '0842415921').then(res=>console.log(res)).catch(
//     err=>{
//         console.log('Lỗi');
//     }
// );

module.exports = {
    getAvailableService
}