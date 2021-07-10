const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailedArticleSchema = new Schema({
    type: { type: String, require: true },
    name: { type: String, require: true },
    data: { type: String, require: true }
},{
    timestamps: true,
});

var DetailedArticle = mongoose.model('DetailedArticle', detailedArticleSchema, 'detailed_article')

module.exports = DetailedArticle;