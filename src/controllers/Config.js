const ProductCategory = require('../models/ProductCategory');

async function getAll(req, res){
    try {
        let productCategorys = await ProductCategory.model.ProductCategory.find({});
        res.status(200).json(productCategorys);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}
async function getConfig(req, res){
    let configuration = {
        categorys: null
    }
    try {
        let productCategorys = await ProductCategory.model.ProductCategory.find({});
        configuration.categorys = productCategorys;
        res.status(200).json(configuration)
    } catch (error) {
        
    }
}

module.exports = getConfig;