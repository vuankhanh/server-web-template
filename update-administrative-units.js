
// Requiring the module
const reader = require('xlsx');
const fse = require('fs-extra');
const db = require('./src/config/db');

const VnAdminUnits = require('./src/models/VnAdministrativeUnits');

const jsonProvince = __dirname + '/src/assets/json/provinces.json';
const jsonDistrict = __dirname + '/src/assets/json/districts.json';
const jsonWard= __dirname + '/src/assets/json/wards.json';
const urlExcelFile = __dirname + '/src/assets/excel/vn_administrative_units.xls';

// Reading our test file
const file = reader.readFile(urlExcelFile)

const sheets = file.SheetNames;
async function converter(){

    for(let i = 0; i < sheets.length; i++){
        const rows = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

        let newRows = [];
        //Refresh Rows
        for(let row of rows){
            let newRow = {
                provinceName: row['Tỉnh Thành Phố'],
                provinceCode: row['Mã TP'],
                districtName: row['Quận Huyện'],
                districtCode: row['Mã QH'],
                wardName: row['Phường Xã'],
                wardCode: row['Mã PX'],
                wardType: row['Cấp']
            };
            newRows.push(newRow);
        }
    
        let provinces = [];
        let districts = [];
        let wards = [];
    
        for(let newRow of newRows){
            let province = {
                name: newRow.provinceName,
                code: newRow.provinceCode
            }

            let checkProvince = checkContainsObject(province, provinces);
            if(!checkProvince){
                provinces.push(province);
            }

            let district = {
                provinceCode: newRow.provinceCode,
                name: newRow.districtName,
                code: newRow.districtCode
            }

            let checkDistrict = checkContainsObject(district, districts);
            if(!checkDistrict){
                districts.push(district)
            }

            let ward = {
                districtCode: newRow.districtCode,
                name: newRow.wardName,
                code: newRow.wardCode,
                type: newRow.wardType
            }

            let checkWard = checkContainsObject(ward, wards);
            if(!checkWard){
                wards.push(ward);
            }
        }

        try {
            await fse.writeJSON(jsonProvince, provinces);
            await fse.writeJSON(jsonDistrict, districts);
            await fse.writeJSON(jsonWard, wards);
            let provinceMongoose = new VnAdminUnits.Province(provinces);
            let resultProvince = await provinceMongoose.save();

            let districtMongoose = new VnAdminUnits.District(districts);
            let resultDistrict = await districtMongoose.save();

            let wardMongoose = new VnAdminUnits.Ward(wards);
            let resultWard = await wardMongoose.save();
        } catch (error) {
            console.log(error.errors);
            
        }

        for(let province of provinces){
            
        }

    }
}

function checkContainsObject(object, array){
    for(let i = 0; i<array.length; i++){
        if(array[i].code === object.code ){
            return true;
        }
    }
    return false;
}
db.connect().then(converter())
// converter();