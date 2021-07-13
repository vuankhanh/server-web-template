const BannerGallery = require('../../models/BannerGallery');
const localPathConfig = require('../../config/local-path');
const singleUploadMiddleware = require("../../middleware/SingleUploadMiddleware");
const convertVie = require('../../services/convert-Vie');
let debug = console.log.bind(console);

async function getAll(req, res){
    try {
        const bannerGallerys = await BannerGallery.model.BannerGallery.find({});
        return res.status(200).json(bannerGallerys);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function insert(req, res){
    try {
        let query = req.query;
        if(query && query.name){
            // thực hiện upload
            await singleUploadMiddleware(req, res);
            
            let file = req.file;
            if (!file) {
                return res.status(400).json({message: 'Missing parameter'})
            }else{
                let absoluteUrlPath = file.path.replace(/\\/g,"/");
                    
                let relativeUrlPath = absoluteUrlPath.replace(localPathConfig.gallery, '');
                let objGallery = {
                    name: convertVie(query.name),
                    bannerName: query.name,
                    src: relativeUrlPath
                }
    
                const bannerGallery = await BannerGallery.model.BannerGallery(objGallery);
                bannerGallery.save()
                // trả về cho người dùng cái thông báo đơn giản.
                return res.status(200).json(bannerGallery);
            }
        }else{
            return res.status(400).json({message: 'Missing parameter'})
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function update(req, res){
    try {
        let query = req.query;
        if(query && query.name && query._id){
            // thực hiện upload
            await singleUploadMiddleware(req, res);
            
            let file = req.file;
            if (!file) {
                return res.status(400).json({message: 'Missing parameter'})
            }else{
                let absoluteUrlPath = file.path.replace(/\\/g,"/");
                    
                let relativeUrlPath = absoluteUrlPath.replace(localPathConfig.gallery, '');
                let objGallery = {
                    name: convertVie(query.name),
                    bannerName: query.name,
                    src: relativeUrlPath
                }
    
                const bannerGallery = await BannerGallery.model.BannerGallery.findByIdAndUpdate(
                    { _id: query._id },
                    {
                        $set:{
                            'name': objGallery.name,
                            'bannerName': objGallery.bannerName,
                            'src': objGallery.src
                        }
                    },
                    { 'new': true }
                );
                // trả về cho người dùng cái thông báo đơn giản.
                return res.status(200).json(bannerGallery);
            }
        }else{
            return res.status(400).json({message: 'Missing parameter'})
        }
    } catch (error) {
        // Nếu có lỗi thì debug lỗi xem là gì ở đây
        debug(error);
        // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json(`Exceeds the number of files allowed to upload.`);
        }
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function remove(req, res){
    const formData = req.body;
    try {
        if(formData._id){
            const bannerGallery = await BannerGallery.model.BannerGallery.findByIdAndRemove(
                { _id: formData._id }
            );
            return res.status(200).json(bannerGallery);
        }else{
            return res.status(400).json({message: 'Missing parameter'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    insert,
    update,
    remove
}