const localPathConfig = require('../../config/local-path');
const singleUploadMiddleware = require("../../middleware/SingleUploadMiddleware");

const Identification = require('../../models/Identification');

const proccessImageService = require('../../services/proccess-image');
const writeBufferToFile = require('../../services/write-buffer-to-file');

async function getAll(req, res){
    try {
        const identification = await Identification.model.Identification.findOne({});
        return res.status(200).json(identification);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insertLogo(req, res){
    try {
        await singleUploadMiddleware(req, res);
        let file = req.file;
        if (!file) {
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            let imageAfterResizing = await proccessImageService.resize(file.path, 'product');
                imageAfterResizing = imageAfterResizing.replace(/\\/g,"/");
            let buffer = await proccessImageService.thumbnail(imageAfterResizing);
            let absoluteUrlThumbnail = writeBufferToFile.thumbnail(imageAfterResizing, buffer).replace(/\\/g,"/");

            let relativeUrlPath = imageAfterResizing.replace(localPathConfig.gallery, '');
            let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');

            const identification = new Identification.model.Identification(
                {
                    'logo': {
                        'src': relativeUrlPath,
                        'srcThumbnail': relativeUrlThumbnail
                    }
                }
            )
            await identification.save();
            return res.status(200).json(identification);
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

async function updateLogo(req, res){
    try {
        await singleUploadMiddleware(req, res);
        let file = req.file;
        if (!file) {
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            let imageAfterResizing = await proccessImageService.resize(file.path, 'product');
                imageAfterResizing = imageAfterResizing.replace(/\\/g,"/");
            let buffer = await proccessImageService.thumbnail(imageAfterResizing);
            let absoluteUrlThumbnail = writeBufferToFile.thumbnail(imageAfterResizing, buffer).replace(/\\/g,"/");

            let relativeUrlPath = imageAfterResizing.replace(localPathConfig.gallery, '');
            let relativeUrlThumbnail = absoluteUrlThumbnail.replace(localPathConfig.gallery, '');

            const identification = await Identification.model.Identification.findOneAndUpdate(
                {},
                {
                    $set: {
                        'logo': {
                            'src': relativeUrlPath,
                            'srcThumbnail': relativeUrlThumbnail
                        }
                    }
                },
                { new: true }
            );
            return res.status(200).json(identification);
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

async function updatePhoneNumber(req, res){
    const formData = req.body;
    try {
        if(!formData.phoneNumber){
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            const identification = await Identification.model.Identification.findOneAndUpdate(
                {},
                {
                    $set: {
                        'phoneNumber': formData.phoneNumber
                    }
                },
                { new: true }
            );
            return res.status(200).json(identification);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function updateSocialNetwork(req, res){
    const formData = req.body;
    try {
        if(!formData.socialNetwork){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const identification = await Identification.model.Identification.findOneAndUpdate(
                {},
                {
                    $set: {
                        'social': formData.socialNetwork
                    }
                },
                { new: true }
            );
            return res.status(200).json(identification);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function updateAddress(req, res){
    const formData = req.body;
    try {
        if(!formData.addresses){
            return res.status(400).json({message: 'Missing parameter'})
        }else{
            const identification = await Identification.model.Identification.findOneAndUpdate(
                {},
                {
                    $set: {
                        'address': formData.addresses
                    }
                },
                { new: true }
            );
            return res.status(200).json(identification);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,

    insertLogo,
    updateLogo,
    updatePhoneNumber,
    updateSocialNetwork,
    updateAddress,
}