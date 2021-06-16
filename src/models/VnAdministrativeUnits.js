const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvinceShema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
},{
    timestamps: true,
});

const DistrictSchema = new Schema({
    provinceCode: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
},{
    timestamps: true,
});

const WardChema = new Schema({
    districtCode: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, required: true }
},{
    timestamps: true,
})

const Province = mongoose.model('Province', ProvinceShema, 'vn_administrative_province');
const District = mongoose.model('District', DistrictSchema, 'vn_administrative_district');
const Ward = mongoose.model('Ward', WardChema, 'vn_administrative_ward');

module.exports = {
    model:{
        Province,
        District,
        Ward,
    },
    schema: {
        ProvinceShema,
        DistrictSchema,
        WardChema,
    }
};