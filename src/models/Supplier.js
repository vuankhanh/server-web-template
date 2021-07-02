const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./Address');

const SupplierSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: false,
        immutable: true
    },
    phoneNumber: { type: String, required: true },
    address: { type:[AddressSchema], default: [] },
},{
    timestamps: true,
})

var Supplier = mongoose.model('Supplier', SupplierSchema, 'supplier');

module.exports = {
    model:{
        Supplier
    },
    schema: {
        SupplierSchema
    }
};