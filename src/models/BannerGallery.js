const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerGalleryShema = new Schema({
    name: { type: String, required: true, unique: false },
    bannerName: { type: String, required: true, unique: false },
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

const BannerGallery = mongoose.model('BannerGallery', BannerGalleryShema, 'banner_gallery');

module.exports = {
    scheme: {
        BannerGalleryShema
    },
    model:{
        BannerGallery
    }
}