const Product = require('../../models/Product');

async function getProductHightlight(req, res){
    try {
        let conditional = { highlight: true };
        let productHightlights = await Product.model.Product.find(
            conditional,
            { albumImg: 0, albumVideo: 0, longDescription: 0 });
        return  res.status(200).json(productHightlights)
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;
    let type = req.query.type;
    try {
        if(type){
            let conditional = { 'category.route': type }
            let countTotal = await Product.model.Product.countDocuments(conditional);
            let filterPage = await Product.model.Product.find(
                conditional,
                {
                    name: 1,
                    code: 1,
                    sortDescription: 1,
                    thumbnailUrl: 1,
                    currencyUnit: 1,
                    theRemainingAmount: 1,
                    price: 1,
                    unit: 1,
                    createdAt: 1,
                    updatedAt: 1
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
        }else{
            console.log('Bad request');
            return res.status(400).json({message: 'Missing parameter'});
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

async function getDetail(req, res){
    let id = req.params._id;
    try {
        if(id){
            let result = await Product.model.Product.findOne({_id: id});
            return res.status(200).json(result);
        }else{
            console.log('Bad request');
            return res.status(400).json({message: 'Missing parameter'});
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
};
module.exports = {
    getProductHightlight,
    getAll,
    getDetail
}