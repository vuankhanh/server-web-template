const Product = require('../../models/Product');

async function getAll(req, res){
    let size = parseInt(req.query.size) || 10;
    let page = parseInt(req.query.page) || 1;
    try {
        let countTotal = await Product.model.Product.find().count();
        let filterPage = await Product.model.Product.find({})
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
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const formData = req.body;
    formData.code = "abc";
    try {
        const product = new Product.model.Product(formData);
        await product.save();
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        if(error.code===11000){
            if(error.keyPattern){
                return res.status(409).json({ key: error.keyPattern, message: 'Insert product category failed' });
            }
        }else{
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function update(req, res){
    const formData = req.body;
}

async function remove(req, res){
    const formData = req.body;
}

module.exports = {
    getAll,
    insert,
    update,
    remove
}