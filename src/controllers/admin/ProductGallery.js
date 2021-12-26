const localPathConfig = require('../../config/local-path');
const multipleUploadMiddleware = require("../../middleware/MultipleUploadMiddleware");
const proccessImage = require('../../services/proccess-image');
const writeBufferToFile = require('../../services/write-buffer-to-file');
const productGalleryDb = require('./ProductGalleryDb');
const convertVie = require('../../services/convert-Vie');
let debug = console.log.bind(console);

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;

    try {
        const productGallerys = await productGalleryDb.get(size, page);
        return res.status(200).json(productGallerys);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function insert(req, res){
    try {
        let query = req.query;
        if(query && query.name){
            // thực hiện upload
            await multipleUploadMiddleware(req, res);
            
            // // Nếu upload thành công, không lỗi thì tất cả các file của bạn sẽ được lưu trong biến req.files
            // debug(req.files);
            // Mình kiểm tra thêm một bước nữa, nếu như không có file nào được gửi lên thì trả về thông báo cho client

            if (!req.files || (req.files && req.files.length <= 0)) {
                return res.status(400).json({message: 'Missing parameter'})
            }else{

                let objGallery = {
                    name: convertVie(query.name),
                    productName: query.name,
                    media: []
                }
                let isMain = parseInt(req.body.isMain);
    
                for(let [index, file] of req.files.entries()){
                    let absoluteUrlPath = file.path.replace(/\\/g,"/");
    
                    let buffer = await proccessImage.thumbnail(file.path);
                    let absoluteUrlThumbnail = writeBufferToFile.thumbnail(file.path, buffer).replace(/\\/g,"/");
    
                    let relativeUrlPath = absoluteUrlPath.replace(localPathConfig.gallery, '');
                    let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');
    
                    let objMedia = {
                        type: file.mimetype.split('/')[0],
                        src: relativeUrlPath,
                        srcThumbnail: relativeUrlThumbnail,
                        isMain: index === isMain ? true : false
                    }
                    objGallery.media.push(objMedia);
                }
    
                const productCategory = await productGalleryDb.insert(objGallery);
                // trả về cho người dùng cái thông báo đơn giản.
                return res.status(200).json(productCategory);
            }
        }else{
            return res.status(400).json({message: 'Missing parameter'});
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

async function update(req, res){
    try {
        let query = req.query;
        if(query && query.name && query._id){
            // thực hiện upload
            await multipleUploadMiddleware(req, res);
            
            // // Nếu upload thành công, không lỗi thì tất cả các file của bạn sẽ được lưu trong biến req.files
            // debug(req.files);
            // Mình kiểm tra thêm một bước nữa, nếu như không có file nào được gửi lên thì trả về thông báo cho client
            if ((req.files.length <= 0) && !req.body.oldMedia) {
                return res.status(400).json({message: 'Missing parameter'})
            }

            let oldMedia = JSON.parse(req.body.oldMedia);
            let objGallery = {
                name: convertVie(query.name),
                productName: query.name,
                media: oldMedia ? oldMedia : []
            }
            let isMain = parseInt(req.body.isMain);

            for(let [index, file] of req.files.entries()){
                let absoluteUrlPath = file.path.replace(/\\/g,"/");

                let buffer = await proccessImage.thumbnail(file.path);
                let absoluteUrlThumbnail = writeBufferToFile.thumbnail(file.path, buffer).replace(/\\/g,"/");

                let relativeUrlPath = absoluteUrlPath.replace(localPathConfig.gallery, '');
                let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');

                let objWillUpload = {
                    type: file.mimetype.split('/')[0],
                    src: relativeUrlPath,
                    srcThumbnail: relativeUrlThumbnail,
                }
                objGallery.media.push(objWillUpload);
            }

            for(let [index, media] of objGallery.media.entries()){
                media.isMain = (isMain === index) ? true : false;
            }

            const productCategory = await productGalleryDb.update(query._id, objGallery);
            // trả về cho người dùng cái thông báo đơn giản.
            return res.status(200).json(productCategory);
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
            const productCategory = await productGalleryDb.remove(formData._id);
            return res.status(200).json(productCategory);
        }else{
            return res.status(400).json({message: 'Missing parameter'});
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