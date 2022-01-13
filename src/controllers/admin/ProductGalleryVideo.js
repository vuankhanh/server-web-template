const ProductGalleryVideo = require('../../models/ProductGalleryVideo');

const convertVieService = require('../../services/convert-Vie');
const matchAdminAccountService = require('../../services/matchAdminAccount');

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;
    try {

        let countTotal = await ProductGalleryVideo.model.ProductGalleryVideo.countDocuments();
        let filterPage = await ProductGalleryVideo.model.ProductGalleryVideo.find({})
        .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(size);
        return res.status(200).json({
            totalItems: countTotal,
            size: size,
            page: page,
            totalPages: Math.ceil(countTotal/size),
            data: filterPage
        })
        
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
}

async function insert(req, res){
    const formData = req.body;
    const query = req.query;
    try {
        if(!query.name || !(formData.urls && formData.urls.length>0)){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let isMain = parseInt(req.body.isMain) | 0;
            let objGallery = {
                name: query.name,
                route: convertVieService(query.name),
                thumbnail: null,
                media: []
            }

            for(let i=0; i<=formData.urls.length-1; i++){
                let youtubeId = formData.urls[i].youtubeId;
                if(!youtubeId){
                    return res.status(400).json({message: 'Missing parameter'});
                }
                let video_id = filterYotubeId(youtubeId);

                let objMedia = {
                    type: 'youtube-video',
                    youtubeId: video_id,
                    isMain: i === isMain ? true : false
                };

                if(i === isMain){
                    objGallery.thumbnail = video_id;
                }
                objGallery.media.push(objMedia);
            }
            let productGalleryVideoResult = new ProductGalleryVideo.model.ProductGalleryVideo(objGallery);
            await productGalleryVideoResult.save();
            return res.status(200).json(productGalleryVideoResult);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function update(req, res){
    const formData = req.body;
    const query = req.query;
    try {
        if(!query.name || !query._id || !formData.urls || !formData.urls.length){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            
            let isMain = parseInt(req.body.isMain) | 0;
            let objGallery = {
                name: query.name,
                route: convertVieService(query.name),
                thumbnail: null,
                media: []
            }

            for(let i=0; i<=formData.urls.length-1; i++){
                let youtubeId = formData.urls[i].youtubeId;
                if(!youtubeId){
                    return res.status(400).json({message: 'Missing parameter'});
                }
                let video_id = filterYotubeId(youtubeId);

                let objMedia = {
                    type: 'youtube-video',
                    youtubeId: video_id,
                    isMain: i === isMain ? true : false
                };

                if(i === isMain){
                    objGallery.thumbnail = video_id;
                }
                objGallery.media.push(objMedia);
            }
            let condition = { _id: query._id }
            let productGalleryVideoResult = await ProductGalleryVideo.model.ProductGalleryVideo.findOneAndUpdate(
                condition,
                {
                    $set: objGallery
                }, { 'new': true }
            );
            return res.status(200).json(productGalleryVideoResult);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function remove(req, res){
    const formData = req.body;
    const jwtDecoded = req.jwtDecoded;
    try {
        if(!formData._id || !formData.password){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const userInfor = jwtDecoded.data;
            let account = {
                userName: userInfor.userName,
                password: formData.password
            }
            let checkAccount = await matchAdminAccountService.getAccount(account);
            if(!checkAccount){
                return res.status(400).json({message: 'Passsword is incorrect'});
            }else{
                let condition = { _id: formData._id }
                let productGalleryVideoResult = await ProductGalleryVideo.model.ProductGalleryVideo.findOneAndRemove(condition);
                return res.status(200).json(productGalleryVideoResult);
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

function filterYotubeId(url){
    let video_id = url.split('v=')[1];
    if(!video_id){
        return url;
    }else{
        let ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }else{
            video_id = video_id.substring(0, video_id.length-1);
        }
        return video_id;
    }
}

module.exports = {
    getAll,
    insert,
    update,
    remove
}