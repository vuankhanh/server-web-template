const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailedArticleSchema = new Schema({
    type: { type: String, require: true },
    name: { type: String, require: true },
    data: { type: String, require: true }
},{
    timestamps: true,
});

const DetailedArticle = mongoose.model('DetailedArticle', DetailedArticleSchema, 'detailed_article')

module.exports = {
    scheme: {
        DetailedArticleSchema
    },
    model:{
        DetailedArticle
    }
}