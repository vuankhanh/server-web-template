const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerGalleryShema = new Schema({
    name: { type: String, required: true, unique: false },
    route: { type: String, required: true, unique: true },
    thumbnail: { type: String, required: true },
    src: { type: String, required: true }
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