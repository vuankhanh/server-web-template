const ProductReviews = require('../../models/ProductReviews');

async function getProductReviews(req, res){
    const productId = req.query.productId;
    try{
        if(!productId){
            return res.status(400).json({ message: 'Missing parameter' });
        }else{
            const condition = { product: productId };
            const result = await ProductReviews.model.ProductReviews.find(condition);
            return res.status(200).json(result);
        }
    }catch(error){
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    const formData = req.body;
    try{
        if(
            (Object.keys(formData).length === 0 && formData.constructor === Object) ||
            !formData.productId ||
            !formData.clientInformation ||
            !formData.clientInformation.name ||
            !formData.clientInformation.phoneNumber ||
            !/((0)+([0-9]{9})\b)/g.test(formData.clientInformation.phoneNumber) ||
            !formData.content ||
            !formData.rating
        ){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const object = {
                product: formData.productId,
                clientInformation: {
                    name: formData.clientInformation.name,
                    phoneNumber: formData.clientInformation.phoneNumber
                },
                content: formData.content,
                rating: formData.rating
            }
            const result = new ProductReviews.model.ProductReviews(object);
            await result.save();
            return res.status(200).json(result);
        }
    }catch(error){
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getProductReviews,
    insert
}