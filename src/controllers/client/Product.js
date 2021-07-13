const Product = require('../../models/Product');

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;
    let type = req.query.type;
    try {
        if(type){
            let conditional = { 'category.route': type }
            let countTotal = await Product.model.Product.countDocuments(conditional);
            let filterPage = await Product.model.Product.find(conditional)
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
    getAll,
    getDetail
}