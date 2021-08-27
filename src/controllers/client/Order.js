const config = require('../../config/evironment');
const Order = require('../../models/Order');
const matchClientAccount = require('../../services/matchClientAccount');

const nextSequenceCode = require('../../services/nextSequenceCode');
const productService = require('../../services/product');

const deliveryStatus = config.order;

async function getAll(req, res){
    try {
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.userName);
        if(!accountId._id){
            return res.status(400).json({message: 'Account not found'});
        }else{
            let size = parseInt(req.query.size) || 10;
            let page = parseInt(req.query.page) || 1;
            let conditional = { accountId: accountId._id };

            let countTotal = await Order.model.Order.countDocuments(conditional);
            let filterPage = await Order.model.Order.find(
                conditional,
                {
                    code: 1,
                    products: 1,
                    totalValue: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            )
            .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
            .limit(size)
            .populate(
                {
                    path: 'products.productId',
                    select: {
                        name: 1,
                        price: 1
                    }
                }
            );
            
            return res.status(200).json({
                totalItems: countTotal,
                size: size,
                page: page,
                totalPages: Math.ceil(countTotal/size),
                data: filterPage
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getDetail(req, res){
    let orderId = req.params._id;
    try {
        if(orderId){
            
            let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.userName);
            if(!accountId._id){
                return res.status(400).json({message: 'Account not found'});
            }else{
    
                let conditional = { _id: orderId };
                let orderDetail = await Order.model.Order.findOne(conditional)
                .populate(
                    {
                        path: 'products.productId',
                        select: {
                            name: 1,
                            price: 1,
                            thumbnailUrl: 1,
                            category: 1
                        }
                    }
                );
                
                return res.status(200).json(orderDetail);
            }
        }else{
            return res.status(400).json({message: 'Missing parameter'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insert(req, res){
    let formData = req.body;
    try {
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.userName);
        if(!accountId._id){
            return res.status(400).json({message: 'Account not found'});
        }else{
            if(!formData.products || !formData.products.length>0){
                return res.status(400).json({message: 'Missing parameter'});
            }else{
                let orderCode = ''
                let nextSequenceOrderCode = await nextSequenceCode.getNextSequence('orderCode');
                if(nextSequenceOrderCode && nextSequenceOrderCode.orderCode){
                    orderCode = nextSequenceCode.padWithZero(nextSequenceOrderCode.orderCode);
                }else{
                    for(let i=0; i<=5; i++){
                        if(nextSequenceOrderCode && nextSequenceOrderCode.orderCode){
                            nextSequenceOrderCode = await nextSequenceCode.getNextSequence('orderCode');
                            orderCode = nextSequenceCode.padWithZero(nextSequenceOrderCode.orderCode);
                            break;
                        }
                    }
                }

                let products = formData.products;
    
                let orderObj = {
                    code: orderCode,
                    accountId: accountId._id,
                    deliverTo: formData.deliverTo,
                    products: [],
                    totalValue: 0
                }
                for(let i=0; i<products.length; i++){
                    let price = await productService.getProductPrice(products[i]._id);
                    if(price >= 0){
                        orderObj.totalValue += (products[i].quantity*price);
                    }else{
                        return res.status(400).json({message: 'Missing parameter'});
                    }
                    orderObj.products.push({
                        productId: products[i]._id,
                        quantity: products[i].quantity
                    })
                }
                const order = new Order.model.Order(orderObj);
                await order.save();
                return res.status(200).json(order);
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function revoke(req, res){
    let formData = req.body;
    try {
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.userName);
        if(!accountId._id){
            res.status(400).json({message: 'Account not found'});
        }else{
            if(!formData || !formData._id){
                return res.status(400).json({message: 'Missing parameter'});
            }else{
                let conditional = { _id: formData._id };
                const order = await Order.model.Order.findByIdAndUpdate(
                    conditional,
                    {
                        $set:{
                            'status': 'revoke',
                        }
                    },
                    { 'new': true }
                ).populate(
                    {
                        path: 'products.productId',
                        select: {
                            name: 1,
                            price: 1,
                            thumbnailUrl: 1,
                            category: 1
                        }
                    }
                );
                return res.status(200).json(order);
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    getDetail,
    insert,
    revoke,
}