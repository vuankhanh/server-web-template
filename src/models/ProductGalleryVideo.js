const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductGalleryVideoShema = new Schema({
    name: { type: String, required: true, unique: false },
    productName: { type: String, required: true, unique: false },
    media: [
        {
            type: { type: String, required: true },
            youtubeId: { type: String, required: true },
            isMain: { type: Boolean, required: true, default: false },
        }
    ]
},{
    timestamps: true,
});

const ProductGalleryVideo = mongoose.model('ProductGalleryVideo', ProductGalleryVideoShema, 'product_gallery_video');

module.exports = {
    scheme: {
        ProductGalleryVideoShema
    },
    model:{
        ProductGalleryVideo
    }
}