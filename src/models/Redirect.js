const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RedirectSchema = new Schema({
    strings: { type: String, required: true, unique: true },
    url: { type: String, required: true }
},{
    timestamps: true,
})

const Redirect = mongoose.model('Redirect', RedirectSchema, 'redirect');

module.exports = {
    model:{
        Redirect
    },
    schema: {
        RedirectSchema
    }
};