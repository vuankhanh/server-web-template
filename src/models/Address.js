const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
    lat: Number,
    lng: Number,
})

const AddressSchema = new Schema({
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    position: PositionSchema,
    isHeadquarters: { type: Boolean, required: true },
},{
    timestamps: true,
});

module.exports = AddressSchema;