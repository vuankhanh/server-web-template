const VnAdminUnits = require('../../models/VnAdministrativeUnits');

async function province(req, res){
    let queryParams = req.query;
    console.log(queryParams);
    console.log('asds');
    try {
        if(queryParams && queryParams.province && queryParams.province === 'all'){
            const province = await VnAdminUnits.model.Province.find({}, { name: 1, code: 1 });
            return res.status(200).json(province);
        }else{
            return res.status(403).json({ message: "Not found province parameter" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function district(req, res){
    let queryParams = req.params;
    console.log(queryParams);
    try {
        if(queryParams && queryParams.provinceCode){
            const districs = await VnAdminUnits.model.District.find(
                { provinceCode: queryParams.provinceCode }
            );
            return res.status(200).json(districs);
        }else{
            return res.status(403).json({ message: "Not found "+ " " });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function ward(req, res){
    let queryParams = req.params;
    console.log(queryParams);
    try {
        if(queryParams && queryParams.districtCode ){
            const wards = await VnAdminUnits.model.Ward.find(
                { districtCode: queryParams.districtCode }
            )
            return res.status(200).json(wards);
        }else{
            return res.status(403).json({ message: "Not found "+ " " });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports ={
    province,
    district,
    ward
};