const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./Address');

const clientAccountSchema = new Schema({
    customerCode: { type: String, required: true, immutable: true },
    userName: {
        type: String,
        unique: true,
        required: true,
        immutable: true
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
        immutable: true
    },
    emailToken: { type: String },
    isVerified: { type: Boolean, require: true, default: false },
    phoneNumber: { type: String, required: true },
    address: { type:[AddressSchema], default: [] },
    facebookId: { type: String },
    googleId: { type: String },
    zaloId: { type: String },
},{
    timestamps: true,
});

var ClientAccount = mongoose.model('ClientAccount', clientAccountSchema, 'client_accounts')

module.exports = ClientAccount;