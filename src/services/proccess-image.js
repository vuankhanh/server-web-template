const sharp = require('sharp');

async function thumbnail(imageUrl){
    return sharp(imageUrl).resize({ width: 400 }).withMetadata().toBuffer();
}

module.exports = {
    thumbnail
}