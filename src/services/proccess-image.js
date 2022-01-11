const sharp = require('sharp');
const fse = require('fs-extra');

const carotaStandart = {
    width: 1280,
    height: 720
}

async function resize(url){
    let destinationImage = changeFileExtension(url, 'webp');
    await sharp(url)
    .resize(carotaStandart)
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