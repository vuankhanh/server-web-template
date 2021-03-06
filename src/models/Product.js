const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductGallerySchema = require('./ProductGallery');
const ProductGalleryVideo = require('./ProductGalleryVideo');
const BannerGallery = require('./BannerGallery');
const ProductCategory = require('./ProductCategory');
const Supplier = require('./Supplier');
const DetailedArticle = require('./DetailedArticle');

const ProductSchema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    route: { type: String, required: true, unique: true },
    category: { type: ProductCategory.scheme.ProductCategoryShema, required: true },
    price: { type: Number, required: true },
    currencyUnit: { type: String, required: true },
    unit: { type: {
        packagingType: { type: String, required: true },
        weightNumber: { type: Number, required: true },
        unitOfMassMeasurement: { type: String, required: true },
    }, required: true },
    thumbnailUrl: { type: String, required: true },
    albumBanner: { type: BannerGallery.scheme.BannerGalleryShema, required: false },
    sortDescription: { type: String, required: true },
    highlight: { type: Boolean, required: true },
    theRemainingAmount: { type: Number, min: 0, required: true },
    longDescription: { type: DetailedArticle.scheme.DetailedArticleSchema, required: true },
    supplier: { type: Supplier.schema.SupplierSchema, required: false },
    albumImg: { type: ProductGallerySchema.scheme.ProductGalleryShema, required: false },
    albumVideo: { type: ProductGalleryVideo.scheme.ProductGalleryVideoShema, required: false }
},{
    timestamps: true,
});

ProductSchema.index({name: 'text', 'longDescription.data' : 'text'});

const Product = mongoose.model('Product', ProductSchema, 'product');

module.exports = {
    scheme: {
        ProductSchema
    },
    model:{
        Product
    }
}
