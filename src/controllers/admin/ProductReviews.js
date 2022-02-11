const ProductReviews = require('../../models/ProductReviews');
const Order = require('../../models/Order');

const enumReviewsStatus = ProductReviews.reviewStatus.map(status=>status.code);

async function getProductReviews(req, res){
    const query = req.query;
    
    const size = parseInt(query.size) || 10;
    const page = parseInt(query.page) || 1;
    const status = query.status;
    try{
        if(
            (!enumReviewsStatus.includes(status) && status)
        ){
            return res.status(400).json({message: 'Status invalid'});
        }else{
            const statusCondition = !status ? {} : { status };

            const condition = { ...statusCondition };
    
            let countTotal = await ProductReviews.model.ProductReviews.countDocuments(condition);
            let filterPage = await ProductReviews.model.ProductReviews.find(
                condition,
                {
                    content: 0
                }
            )
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

module.exports = {
    getProductReviews
}