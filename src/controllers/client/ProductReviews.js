const ProductReviews = require('../../models/ProductReviews');
const Order = require('../../models/Order');

async function getTotalProductReviews(req, res){
    const productId = req.query.productId;
    try{
        if(!productId){
            return res.status(400).json({ message: 'Missing parameter' });
        }else{
            let result = {};
            for(let i=1; i<=5; i++){
                let condition = {
                    rating: i,
                    censored: true,
                    status: 'confirmed'
                };
                let countTotal = await ProductReviews.model.ProductReviews.countDocuments(condition);
                result['level'+i]=countTotal;
            }
            return res.status(200).json(result);
        }
    }catch(error){
        return res.status(500).json({ message: 'Something went wrong' });
    }
}
async function getProductReviews(req, res){
    const productId = req.query.productId;
    try{
        if(!productId){
            return res.status(400).json({ message: 'Missing parameter' });
        }else{
            const size = parseInt(req.query.size) || 10;
            const page = parseInt(req.query.page) || 1;
            const condition = {
                product: productId,
                status: 'confirmed'
            };

            let countTotal = await ProductReviews.model.ProductReviews.countDocuments(condition);
            let filterPage = await ProductReviews.model.ProductReviews.find(condition)
            .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
            .limit(size)
            .lean();
            
            if(filterPage.length){
                for(let i=0;i<=filterPage.length-1; i++){
                    let review = filterPage[i];
                    let condition = {
                        'products.productId': review.product,
                        'deliverTo.phoneNumber': review.clientInformation.phoneNumber
                    }
                    let count = await Order.model.Order.countDocuments(condition);
                    if(count){
                        filterPage[i].purchaseConfirmation = true;
                    }
                }
            }
            
            return res.status(200).json({
                totalItems: countTotal,
                size: size,
                page: page,
                totalPages: Math.ceil(countTotal/size),
                data: filterPage
            });
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
    getTotalProductReviews,
    getProductReviews,
    insert
}