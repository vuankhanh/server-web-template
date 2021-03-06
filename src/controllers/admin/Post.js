const DetailedArticle = require('../../models/DetailedArticle');

async function getAll(req, res){
    const query = req.query;
    let size = parseInt(query.size) || 10;
    let page = parseInt(query.page) || 1;
    let type = query.type || "product";
    try {
        const condition = { type };
        const countTotalPosts = await DetailedArticle.model.DetailedArticle.countDocuments(condition);
        const filterPagePosts = await DetailedArticle.model.DetailedArticle.find(condition)
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
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const formData = req.body;
    try {
        if(formData){
            formData.data = JSON.stringify(formData.data);
            const detailedArticle = new DetailedArticle.model.DetailedArticle(formData);
            await detailedArticle.save();
            return res.status(200).json(detailedArticle);
        }else{
            return res.status(400).json({message: 'Missing parameter'});
        }
        
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function update(req, res){
    const formData = req.body;
    try {
        if(formData){
            formData.data = JSON.stringify(formData.data);
            const result = await DetailedArticle.model.DetailedArticle.findByIdAndUpdate(
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
            return res.status(400).json({message: 'Missing parameter'});
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function remove(req, res){
    const formData = req.body;
    try {
        if(formData._id){
            const result = await DetailedArticle.model.DetailedArticle.findOneAndRemove(
                {_id: formData._id}
            );
            return res.status(200).json(result);
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