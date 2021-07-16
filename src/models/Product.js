const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductGallerySchema = require('./ProductGallery');
const BannerGallery = require('./BannerGallery');
const ProductCategory = require('./ProductCategory');
const Supplier = require('./Supplier');
const DetailedArticle = require('./DetailedArticle');

const ProductShema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: ProductCategory.scheme, required: true },
    price: { type: Number, required: true },
    currencyUnit: { type: String, required: true },
    unit: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    albumBanner: { type: BannerGallery, required: false },
    sortDescription: { type: String, required: true },
    highlight: { type: Boolean, required: true },
    theRemainingAmount: { type: Number, required: true },
    longDescription: { type: DetailedArticle, required: true },
    supplier: { type: Supplier, required: false },
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
