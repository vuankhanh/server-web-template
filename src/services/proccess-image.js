const sharp = require('sharp');
const fse = require('fs-extra');

const carotaSize = {
    product: {
        width: 1000,
        height: 1000
    },
    banner: {
        width: 1280,
        height: 720
    }
}


async function resize(url, type){
    let size = type === 'product' ? carotaSize.product : carotaSize.banner;
    console.log(size);
    let destinationImage = changeFileExtension(url, 'webp');
    await sharp(url)
    .resize(size)
    .webp()
    .toFile(destinationImage);

    fse.removeSync(url);

    return destinationImage;
}

async function thumbnail(imageUrl){
    return sharp(imageUrl).resize({ width: 400 }).withMetadata().toBuffer();
}

function changeFileExtension(originalImage, type){
    let destinationImage = originalImage.substring(0, originalImage.lastIndexOf('.')+1)+type;
    return destinationImage;
}

module.exports = {
    resize,
    thumbnail
}