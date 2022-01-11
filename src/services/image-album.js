const fse = require('fs-extra');

const ProductGallery = require('../models/ProductGallery');
const localPathConfig = require('../config/local-path');

const convertVie = require('./convert-Vie');

async function checkExistAlbum(name){
    let condition = { route: convertVie(name) }
    return await ProductGallery.model.ProductGallery.countDocuments(condition);
}

async function refreshMain(id, mainIndex){
    let condition = { _id: id };
    const result = await ProductGallery.model.ProductGallery.findOne(condition);
    if(result && (mainIndex <= result.media.length)){
        let thumbnail = null;
        for(const [index, media] of result.media.entries()){
            if(mainIndex === index){
                media.isMain = true;
                thumbnail = media.srcThumbnail;
            }else{
                media.isMain = false;
            }
        };

        return await ProductGallery.model.ProductGallery.findOneAndUpdate(
            condition,
            {
                $set: {
                    thumbnail,
                    media: result.media
                }
            },
            { new: true }
        )
    }

    return result;
}

function removeImage(media){
    for(let image of media){
        removeFile(image);
    }
}

function removeFile(image){
    let srcUrl = localPathConfig.gallery+'/'+image.src;
    let srcThumbnailUrl = localPathConfig.gallery+'/'+image.srcThumbnail;
    let existsSrc = fse.existsSync(srcUrl);
    let existsSrcThumbnail = fse.existsSync(srcThumbnailUrl);

    if(existsSrc){
        fse.removeSync(srcUrl);
    }

    if(existsSrcThumbnail){
        fse.removeSync(srcThumbnailUrl);
    }
}

module.exports = {
    checkExistAlbum,
    refreshMain,
    removeImage
}