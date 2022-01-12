const fse = require('fs-extra');
const path = require('path');

const localPathConfig = require('../config/local-path');

const BannerGallery = require('../models/BannerGallery');

const convertVieService = require('./convert-Vie');

async function checkExistBannerRoute(name){
    let condition = { route: convertVieService(name) }
    return await BannerGallery.model.BannerGallery.countDocuments(condition);
}

async function checkExistBannerId(id){
    let condition = { _id: id }
    return await BannerGallery.model.BannerGallery.countDocuments(condition);
}

function removeFile(src, thumbnail){
    let srcUrl = localPathConfig.gallery+'/'+src;
    let srcThumbnailUrl = localPathConfig.gallery+'/'+thumbnail;
    let existsSrc = fse.existsSync(srcUrl);
    let existsSrcThumbnail = fse.existsSync(srcThumbnailUrl);

    if(existsSrc){
        fse.removeSync(srcUrl);
    }

    if(existsSrcThumbnail){
        fse.removeSync(srcThumbnailUrl);
    }

    getParentDirectory(srcUrl);
}

function getParentDirectory(urlFile){
    let split = path.dirname(urlFile).split(path.sep);
    let parent = split.join('/');
    removeEmptyFolder(parent);
}

function removeEmptyFolder(directory){
    try {
        let files = fse.readdirSync(directory);
        if(!files.length){
            fse.rmdirSync(directory);
        }
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {
    checkExistBannerRoute,
    checkExistBannerId,
    removeFile
}