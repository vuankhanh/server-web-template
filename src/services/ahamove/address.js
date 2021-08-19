module.exports = (carotaAddress)=>{
    try {
        let arrCarotaAddress = [
            carotaAddress.street,
            carotaAddress.ward.name,
            carotaAddress.district.name,
            carotaAddress.province.name
        ];
    
        return arrCarotaAddress.join(',');
    } catch (error) {
        return null
    }   
}