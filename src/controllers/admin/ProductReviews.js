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

async function getProductReviewsDetail(req, res){
    const params = req.params;
    try{
        if(!params.commentId){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const id = params.commentId;
            const result = await ProductReviews.model.ProductReviews.findById(id)
            .populate(
                {
                    path: 'product',
                    select: {
                        name: 1,
                        price: 1,
                        thumbnailUrl: 1,
                        category: 1,
                        sortDescription: 1
                    }
                }
            ).lean();

            if(result){

                let condition = {
                    'products.productId': result.product._id,
                    'deliverTo.phoneNumber': result.clientInformation.phoneNumber
                }
                let count = await Order.model.Order.countDocuments(condition);
                if(count){
                    result.purchaseConfirmation = true;
                }
            }

            return res.status(200).json(result);
        }
    }catch(error){
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function changeProductReviewsStatus(req, res){
    const params = req.params;
    const commentId = params.commentId;

    const formData = req.body;
    const newStatus = formData.newStatus;
    try {
        if(
            !commentId ||
            (Object.keys(formData).length === 0 && formData.constructor === Object) ||
            !enumReviewsStatus.includes(newStatus)
        ){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const productReviewsIsRevoked = await ProductReviews.model.ProductReviews.findOneAndUpdate(
                { _id: commentId },
                {
                    $set: {
                        status: newStatus
                    }
                },
                { 'new': true }
            ).populate(
                {
                    path: 'product'
                }
            ).lean();

            if(productReviewsIsRevoked){

                let condition = {
                    'products.productId': productReviewsIsRevoked.product._id,
                    'deliverTo.phoneNumber': productReviewsIsRevoked.clientInformation.phoneNumber
                }
                let count = await Order.model.Order.countDocuments(condition);
                if(count){
                    productReviewsIsRevoked.purchaseConfirmation = true;
                }
            };
            return res.status(200).json(productReviewsIsRevoked);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getProductReviews,
    getProductReviewsDetail,
    changeProductReviewsStatus
}