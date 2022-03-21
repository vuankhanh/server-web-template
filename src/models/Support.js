const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupportSchema = new Schema({
    name: { type: String, required: true, unique: true },
    route: { type: String, required: true, unique: true },
    postsId: { type: Schema.Types.ObjectId, ref: 'DetailedArticle', required: true }
},{
    timestamps: true,
})

const Support = mongoose.model('Support', SupportSchema, 'support');

module.exports = {
    model:{
        Support
    },
    schema: {
        SupportSchema
    }
};