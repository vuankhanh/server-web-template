const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./Address');

const IdentificationSchema = new Schema({
    logo: {
        type: {
            src: { type: String, required: true },
            srcThumbnail: { type: String, required: false },
        }
    },
    address: { type: [AddressSchema] },
    phoneNumber:{ 
        type: [
            { number: String, isMain: Boolean }
        ]
    },
    social: {
        type: [
            {
                name: { type: String },
                url: { type: String }
            }
        ]
    }
},{
    timestamps: true,
});

const Identification = mongoose.model('Identification', IdentificationSchema, 'identification')

module.exports = {
    scheme: {
        IdentificationSchema
    },
    model:{
        Identification
    }
}