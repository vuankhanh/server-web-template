const DetailedArticleModel = require('../../models/DetailedArticle');

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query.type || "product";
    try {
        const condition = { type: query };
        console.log(condition)
        const countTotalPosts = await DetailedArticleModel.countDocuments(condition);
        const filterPagePosts = await DetailedArticleModel.find(condition)
        .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(size);

        return res.status(200).json({
            totalItems: countTotalPosts,
            size: size,
            page: page,
            totalPages: Math.ceil(countTotalPosts/size),
            data: filterPagePosts
        });
    } catch (error) {
        
    }
}

async function insert(req, res){
    const formData = req.body;
    try {
        if(formData){
            formData.data = JSON.stringify(formData.data);
            const detailedArticle = new DetailedArticleModel(formData);
            await detailedArticle.save();
            return res.status(200).json(detailedArticle);
        }else{
            return res.status(400).json({message: 'Missing parameter'});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function update(req, res){
    const formData = req.body;
    try {
        if(formData){
            formData.data = JSON.stringify(formData.data);
            const result = await DetailedArticleModel.findByIdAndUpdate(
                { _id: formData._id },
                {
                    $set:{
                        'type': formData.type,
                        'name': formData.name,
                        'data': formData.data,
                    }
                },
                { 'new': true }
            );
            return res.status(200).json(result);
        }else{
            console.log('Bad request');
            return res.status(400).json({message: 'Missing parameter'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function remove(req, res){
    const formData = req.body;
    try {
        if(formData._id){
            const result = await DetailedArticleModel.findOneAndRemove(
                {_id: formData._id}
            );
            console.log(result);
            return res.status(200).json(result);
        }else{
            console.log('Bad request');
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