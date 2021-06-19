const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VnAdministrativeUnitsSchemae = require("./VnAdministrativeUnits");

const PositionSchema = new Schema({
    lat: Number,
    lng: Number,
})

const AddressSchema = new Schema({
    responsiblePerson: { type: String, require: true },
    phoneNumber: { type: String, require: true },
    street: { type: String, required: true },
    ward: {
        type: VnAdministrativeUnitsSchemae.schema.WardChema,
        required: true
    },
    district: {
        type: VnAdministrativeUnitsSchemae.schema.DistrictSchema,
        required: true
    },
    province: {
        type: VnAdministrativeUnitsSchemae.schema.ProvinceShema,
        required: true
    },
    position: PositionSchema,
    isHeadquarters: { type: Boolean, default: true, required: true },
},{
    timestamps: true,
});

module.exports = AddressSchema;