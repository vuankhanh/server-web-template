const config = require('../../../config/evironment');

const axios = require('axios');

let token = config.ghn.token;
let host = config.ghn.env;

async function getProvinceId(carotaProvinceName){
    const option = {
        url: host+'/shiip/public-api/master-data/province',
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
            let ghnProvinces = result.data;
            let index = ghnProvinces.findIndex(province=>province.NameExtension.includes(carotaProvinceName));
            return index >=0 ? ghnProvinces[index].ProvinceID : false;
        }
    }
    return false;
}

async function getDistrictId(carotaDistrictName, ghnProvinceId){
    const option = {
        url: host+'/shiip/public-api/master-data/district',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        params: {
            province_id: ghnProvinceId
        }
    }
    let response = await axios(option);
    if(response.data){
        let result = response.data
        if(result && result.code === 200){
            let ghnDistricts = result.data;
            let index = ghnDistricts.findIndex(district=>district.NameExtension.includes(carotaDistrictName));
            return index >=0 ? ghnDistricts[index].DistrictID : false;
        }
    }
    return false;
}

async function getWardCode(carotaWardName, ghnDistrictId){
    const option = {
        url: host+'/shiip/public-api/master-data/ward',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        params: {
            district_id: ghnDistrictId
        }
    }
    let response = await axios(option);
    if(response.data){
        let result = response.data
        if(result && result.code === 200){
            let ghnWards = result.data;
            let index = ghnWards.findIndex(ward=>ward.NameExtension.includes(carotaWardName));
            return index >=0 ? ghnWards[index].WardCode : false;
        }
    }
    return false;
}

module.exports = {
    getProvinceId,
    getDistrictId,
    getWardCode,
}

// // getProvinceId('Thành phố Hà Nội').then(res=>{
// //     console.log(res);
// // })

// // getDistrictId('Quận Hoàn Kiếm', 201).then(res=>{
// //     console.log(res);
// // })

// getWardCode('Phường Đồng Xuân', 1489).then(res=>{
//     console.log(res);
// })