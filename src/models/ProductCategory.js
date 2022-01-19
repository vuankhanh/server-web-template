const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductCategoryShema = new Schema({
    name: { type: String, required: true, unique : true, dropDups: true },
    route: { type: String, required: true, unique : true, dropDups: true },
    googleProductCategory: { type: String, required: true }
},{
    timestamps: true,
});

const ProductCategory = mongoose.model('ProductCategory', ProductCategoryShema, 'product_category');

module.exports = {
    scheme: {
        ProductCategoryShema
    },
    model:{
        ProductCategory
    }
}