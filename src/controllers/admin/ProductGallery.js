const localPathConfig = require('../../config/local-path');
const multipleUploadMiddleware = require("../../middleware/MultipleUploadMiddleware");

const ProductGallery = require('../../models/ProductGallery');

const proccessImageService = require('../../services/proccess-image');
const convertVieService = require('../../services/convert-Vie');
const writeBufferToFile = require('../../services/write-buffer-to-file');
const productGalleryService = require('../../services/product-gallery');
const matchAdminAccountService = require('../../services/matchAdminAccount');

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;

    try {
        const condition = { };
        let countTotal = await ProductGallery.model.ProductGallery.countDocuments(condition);
        let filterPage = await ProductGallery.model.ProductGallery.find(
            condition,
            {
                media: 0
            }
        )
        .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(size);
        return res.status(200).json({
            totalItems: countTotal,
            size: size,
            page: page,
            totalPages: Math.ceil(countTotal/size),
            data: filterPage
        });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function getDetail(req, res){
    try {
        const params = req.params;
        if(!params.id){
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            const productGallery = await ProductGallery.model.ProductGallery.findById(params.id);
            return res.status(200).json(productGallery);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const query = req.query;
    try {
        if(!query || !query.name){
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            let count = await productGalleryService.checkExistAlbumRoute(query.name);
            if(count){
                return res.status(409).json({ message: 'This image album already exists' });
            }
            await multipleUploadMiddleware(req, res);
    
            if (!req.files || !req.files.length) {
                return res.status(400).json({message: 'Missing parameter'})
            }else{
                let objGallery = {
                    name: query.name,
                    route: convertVieService(query.name),
                    thumbnail: null,
                    media: []
                };

                let parseIntIsMain = parseInt(req.body.isMain);
                let isMain = parseIntIsMain >= 0 ? parseIntIsMain : 0;
    
                for(let [index, file] of req.files.entries()){
                    let imageAfterResizing = await proccessImageService.resize(file.path, 'product');
                        imageAfterResizing = imageAfterResizing.replace(/\\/g,"/");
                    let buffer = await proccessImageService.thumbnail(imageAfterResizing);
                    let absoluteUrlThumbnail = writeBufferToFile.thumbnail(imageAfterResizing, buffer).replace(/\\/g,"/");

                    let relativeUrlPath = imageAfterResizing.replace(localPathConfig.gallery, '');
                    let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');
    
                    let objMedia = {
                        type: file.mimetype.split('/')[0],
                        src: relativeUrlPath,
                        srcThumbnail: relativeUrlThumbnail,
                        isMain: index === isMain ? true : false
                    }

                    if(index === isMain){
                        objGallery.thumbnail = relativeUrlThumbnail;
                    }

                    objGallery.media.push(objMedia);
                };
                const result = new ProductGallery.model.ProductGallery(objGallery);
                await result.save();

                return res.status(200).json(result);
            }
        }
    } catch (error) {
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json(`Exceeds the number of files allowed to upload.`);
        }else if(error.code === 'INVALID_IMAGE_FORMAT'){
            return res.status(400).json({ message: error.message });
        }else if(error.code === 'UNSOPPORTED_FILE'){
            return res.status(501).json({ message: error.message });
        }else if(error.code===11000){
            return res.status(409).json(
                {
                    message: 'This image album already exists',
                    field: error.keyPattern
                }
            );
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function update(req, res){
    const query = req.query;
    try {
        if(!query || !query.name || !query._id){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let count = await productGalleryService.checkExistAlbumId(query._id);
            if(!count){
                return res.status(404).json({ message: 'The Product Gallery is not found' });
            }

            await multipleUploadMiddleware(req, res);

            let mediaWillBeDeleted = req.body.mediaWillBeDeleted;
            let objGallery = {
                name: query.name,
                route: convertVieService(query.name),
                thumbnail: null,
                mediaWillBeAdded: [],
                mediaWillBeDeleted: mediaWillBeDeleted? JSON.parse(mediaWillBeDeleted) : []
            }

            let parseIntIsMain = parseInt(req.body.isMain);
            let isMain = parseIntIsMain >= 0 ? parseIntIsMain : 0;

            for(let [index, file] of req.files.entries()){
                
                let imageAfterResizing = await proccessImageService.resize(file.path, 'product');
                    imageAfterResizing = imageAfterResizing.replace(/\\/g,"/");
                let buffer = await proccessImageService.thumbnail(imageAfterResizing);
                let absoluteUrlThumbnail = writeBufferToFile.thumbnail(imageAfterResizing, buffer).replace(/\\/g,"/");

                let relativeUrlPath = imageAfterResizing.replace(localPathConfig.gallery, '');
                let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');

                let objMedia = {
                    type: file.mimetype.split('/')[0],
                    src: relativeUrlPath,
                    srcThumbnail: relativeUrlThumbnail,
                    isMain: index === isMain ? true : false
                }

                if(index === isMain){
                    objGallery.thumbnail = relativeUrlThumbnail;
                }

                objGallery.mediaWillBeAdded.push(objMedia);
            }

            const result = await ProductGallery.model.ProductGallery.findByIdAndUpdate(
                query._id,
                {
                    $set:{
                        'name': objGallery.name,
                        'route': objGallery.route
                    },$push:{
                        'media':{
                            $each: objGallery.mediaWillBeAdded
                        }
                    }
                },
                { 'new': true }
            );
            
            if(!result){
                return res.status(200).json(result);
            }else{
                if(!objGallery.mediaWillBeDeleted.length){
                    const afterRefreshMain = await productGalleryService.refreshMain(query._id, isMain);
                    return res.status(200).json(afterRefreshMain);
                }else{
                    const pullAllProductGallery = await ProductGallery.model.ProductGallery.findByIdAndUpdate(
                        query._id,
                        {
                            $pullAll: {
                                'media': objGallery.mediaWillBeDeleted
                            }
                        },{ 'new': true }
                    );

                    if(!pullAllProductGallery){
                        return res.status(200).json(pullAllProductGallery);
                    }else{
                        productGalleryService.removeImage(objGallery.mediaWillBeDeleted);
                        const afterRefreshMain = await productGalleryService.refreshMain(query._id, isMain);
                        return res.status(200).json(afterRefreshMain);
                    }
                }
            }
        }
    } catch (error) {
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json(`Exceeds the number of files allowed to upload.`);
        }else if(error.code === 'INVALID_IMAGE_FORMAT'){
            return res.status(400).json({ message: error.message });
        }else if(error.code === 'UNSOPPORTED_FILE'){
            return res.status(501).json({ message: error.message });
        }else if(error.code===11000){
            return res.status(409).json(
                {
                    message: 'This image album already exists',
                    field: error.keyPattern
                }
            );
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
        }
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
                const result = await ProductGallery.model.ProductGallery.findOneAndRemove(
                    {_id: formData._id}
                );
                if(!result){
                    return res.status(404).json({message: 'Id Banner Gallery is not found'});
                }else{
                    productGalleryService.removeImage(result.media);
                    return res.status(200).json(result);
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    getDetail,
    insert,
    update,
    remove
}