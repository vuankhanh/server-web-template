const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductGalleryShema = new Schema({
    name: { type: String, required: true, unique: false },
    productName: { type: String, required: true, unique: false },
    media: [
        {
            type: { type: String, required: true },
            src: { type: String, required: true },
            srcThumbnail: { type: String, required: false, default: null },
            isMain: { type: Boolean, required: true, default: false },
        }
    ]
},{
    timestamps: true,
});

const ProductGallery = mongoose.model('ProductGallery', ProductGalleryShema, 'product_gallery');

module.exports = {
    scheme: {
        ProductGalleryShema
    },
    model:{
        ProductGallery
    }
}