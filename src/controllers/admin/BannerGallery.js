const BannerGallery = require('../../models/BannerGallery');
const localPathConfig = require('../../config/local-path');

const singleUploadMiddleware = require("../../middleware/SingleUploadMiddleware");

const proccessImageService = require('../../services/proccess-image');
const writeBufferToFileService = require('../../services/write-buffer-to-file');
const convertVieService = require('../../services/convert-Vie');
const bannerGalleryService = require('../../services/banner-gallery');
const matchAdminAccountService = require('../../services/matchAdminAccount');

async function getAll(req, res){
    try {
        const bannerGallerys = await BannerGallery.model.BannerGallery.find({});
        return res.status(200).json(bannerGallerys);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function insert(req, res){
    try {
        let query = req.query;
        if(!query.name){
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            let count = await bannerGalleryService.checkExistBannerRoute(query.name);
            if(count){
                return res.status(409).json({ message: 'This image album already exists' });
            }
            // thực hiện upload
            await singleUploadMiddleware(req, res);
            //pending here
            let file = req.file;
            if (!file) {
                return res.status(400).json({message: 'Missing parameter'})
            }else{

                let imageAfterResizing = await proccessImageService.resize(file.path, 'banner');
                    imageAfterResizing = imageAfterResizing.replace(/\\/g,"/");
                let buffer = await proccessImageService.thumbnail(imageAfterResizing);
                let absoluteUrlThumbnail = writeBufferToFileService.thumbnail(imageAfterResizing, buffer).replace(/\\/g,"/");

                let relativeUrlPath = imageAfterResizing.replace(localPathConfig.gallery, '');
                let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');

                let objGallery = {
                    name: query.name,
                    route: convertVieService(query.name),
                    src: relativeUrlPath,
                    thumbnail: relativeUrlThumbnail
                }
    
                const bannerGallery = await BannerGallery.model.BannerGallery(objGallery);
                bannerGallery.save()
                // trả về cho người dùng cái thông báo đơn giản.
                return res.status(200).json(bannerGallery);
            }
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function update(req, res){
    try {
        let query = req.query;

        if(!query.name || !query._id){
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            let condition = { _id: query._id };
            let bannerGalleryResult = await BannerGallery.model.BannerGallery.findOne(condition);
            if(!bannerGalleryResult){
                return res.status(404).json({ message: 'The Product Gallery is not found' });
            }

            // thực hiện upload
            await singleUploadMiddleware(req, res);

            let file = req.file;

            let objGallery = {
                name: query.name,
                route: convertVieService(query.name)
            }

            if(file){
                let imageAfterResizing = await proccessImageService.resize(file.path, 'banner');
                    imageAfterResizing = imageAfterResizing.replace(/\\/g,"/");
                let buffer = await proccessImageService.thumbnail(imageAfterResizing);
                let absoluteUrlThumbnail = writeBufferToFileService.thumbnail(imageAfterResizing, buffer).replace(/\\/g,"/");

                let relativeUrlPath = imageAfterResizing.replace(localPathConfig.gallery, '');
                let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');

                objGallery.src = relativeUrlPath;
                objGallery.thumbnail = relativeUrlThumbnail;
            }

            const bannerGallery = await BannerGallery.model.BannerGallery.findByIdAndUpdate(
                { _id: query._id },
                {
                    $set: objGallery
                },
                { 'new': true }
            )

            if(file){
                bannerGalleryService.removeFile(bannerGalleryResult.src, bannerGalleryResult.thumbnail);
            }

            // trả về cho người dùng cái thông báo đơn giản.
            return res.status(200).json(bannerGallery);
        }
    } catch (error) {
        console.log(error);
        // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json(`Exceeds the number of files allowed to upload.`);
        }
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function remove(req, res){
    const formData = req.body;
    const jwtDecoded = req.jwtDecoded;
    try {
        const userInfor = jwtDecoded.data;
        
        if(!formData._id || !formData.password){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let account = {
                userName: userInfor.userName,
                password: formData.password
            }
            let checkAccount = await matchAdminAccountService.getAccount(account);
            if(!checkAccount){
                return res.status(400).json({message: 'Passsword is incorrect'});
            }else{
                const bannerGalleryResult = await BannerGallery.model.BannerGallery.findByIdAndRemove(
                    { _id: formData._id }
                );
                if(!bannerGalleryResult){
                    return res.status(404).json({message: 'Id Banner Gallery is not found'});
                }else{
                    bannerGalleryService.removeFile(bannerGalleryResult.src, bannerGalleryResult.thumbnail);
                    return res.status(200).json(bannerGalleryResult);
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    insert,
    update,
    remove
}