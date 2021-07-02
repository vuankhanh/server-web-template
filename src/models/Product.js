const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductGallerySchema = require('./ProductGallery');
const ProductCategory = require('./ProductCategory');
const Supplier = require('./Supplier');

const ProductShema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: ProductCategory.scheme, required: true },
    price: { type: Number, required: true },
    currencyUnit: { type: String, required: true },
    unit: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    imgBannerUrl: { type: String, required: false },
    sortDescription: { type: String, required: true },
    highlight: { type: Boolean, required: true },
    theRemainingAmount: { type: Number, required: true },
    longDescription: { type: String, required: true },
    supplier: { type: Supplier.schema, required: false },
    albumImg: { type: ProductGallerySchema, required: false },
    albumVideo: { type: ProductGallerySchema, required: false }
},{
    timestamps: true,
});

const Product = mongoose.model('Product', ProductShema, 'product');

module.exports = {
    scheme: {
        ProductShema
    },
    model:{
        Product
    }
}
