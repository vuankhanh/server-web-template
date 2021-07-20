const Product = require('../models/Product');

async function getProductPrice(productId){
    try {
        let condition = { _id: productId };
        let product = await Product.model.Product.findOne(condition, { price: 1 });
        if(product) return product.price;
        return -1;
    } catch (error) {
        return -1;
    }
}

module.exports = {
    getProductPrice
}