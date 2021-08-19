const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./Address');

const accountTypeSchema = new Schema({
    userName: { type: String, required: true, immutable: true, unique: true },
    password: { type: String, required: true },
    emailToken: {
        type: String,
        required: function(){
            return this.isVerified === false;
        }
    },
    isVerified: { type: Boolean, require: true, default: false }
})

const ClientAuthenticationSchema = new Schema({
    customerCode: { type: String, required: true, immutable: true },
    email: {
        type: String,
        unique: true,
        required: true,
        immutable: true
    },
    phoneNumber: { type: String },
    name: { type: String },
    address: { type:[AddressSchema], default: [] },
    allowAccount: { type: Boolean },
    allowFacebook: { type: Boolean },
    allowGoogle: { type: Boolean },
    allowZalo: { type: Boolean },
    account: {
        type: accountTypeSchema,
        required: function(){
            return this.allowAccount === true;
        }
    },
    facebookId: { 
        type: String,
        required: function(){
            return this.allowFacebook === true;
        }
    },
    googleId: { 
        type: String,
        required: function(){
            return this.allowGoogle === true;
        }
    },
    zaloId: {
        type: String,
        required: function(){
            return this.allowZalo === true;
        }
    },
},{
    timestamps: true,
});

var ClientAuthentication = mongoose.model('ClientAuthentication', ClientAuthenticationSchema, 'client_authentication')


module.exports = ClientAuthentication;