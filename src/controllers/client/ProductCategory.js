const ProductCategory = require('../../models/ProductCategory');
const Product = require('../../models/Product');

module.exports = async(req, res)=>{
    try {
        let productCategories = await ProductCategory.model.ProductCategory.find({}).lean();
        for(let i=0; i<=productCategories.length-1; i++){
            let productCategory = productCategories[i];
            let condition = { 'category.route': productCategory.route };
            const product = await Product.model.Product.findOne(
                condition,
                {
                    thumbnailUrl: 1
                }
            );
            if(product){
                productCategories[i].thumbnailUrl = product.thumbnailUrl;
            }
        }
        // console.log(productCategories);
        return res.status(200).json(productCategories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}