const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./Address');

const clientAccountSchema = new Schema({
    customerCode: { type: String, required: true },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    name: {type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: { type: String, required: true },
    address: {type:[AddressSchema], default: []},
    facebookId: { type: String },
    googleId: { type: String },
    zaloId: { type: String },
},{
    timestamps: true,
});

var ClientAccount = mongoose.model('ClientAccount', clientAccountSchema, 'client_accounts')

module.exports = ClientAccount;