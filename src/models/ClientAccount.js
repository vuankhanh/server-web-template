const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./Address');

const clientAccountSchema = new Schema({
    customerCode: { type: String, required: true },
    account: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: [AddressSchema],
    facebookId: { type: String },
    googleId: { type: String },
    zaloId: { type: String },
},{
    timestamps: true,
});

var ClientAccount = mongoose.model('ClientAccount', clientAccountSchema, 'client_accounts')

module.exports = ClientAccount;