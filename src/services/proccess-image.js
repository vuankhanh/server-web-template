const sharp = require('sharp');

async function thumbnail(imageUrl){
    return sharp(imageUrl).resize({ width: 100 }).withMetadata().toBuffer();
}

module.exports = {
    thumbnail
}