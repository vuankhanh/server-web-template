const ProductCategory = require('../../models/ProductCategory');

module.exports = async(req, res)=>{
    try {
        let productCategorys = await ProductCategory.model.ProductCategory.find({});
        res.status(200).json(productCategorys);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}