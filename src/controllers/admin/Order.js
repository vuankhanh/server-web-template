const Order = require('../../models/Order');
const matchAdminAccount = require('../../services/matchAdminAccount');
const nextSequenceCode = require('../../services/nextSequenceCode');
const productService = require('../../services/product');

const enumOrderStatus = Order.orderStatus.map(status=>status.code);
const enumOrderCreatedBy = Order.orderCreatedBy.map(createdBy=>createdBy.code);

async function getAll(req, res){
    const query = req.query;
    
    const size = parseInt(query.size) || 10;
    const page = parseInt(query.page) || 1;
    const status = query.status;
    const createdBy = query.createdBy;
    const orderCode = query.orderCode;
    const phoneNumber = query.phoneNumber;

    const date = new Date();
    const fromDate = (new Date(parseInt(query.fromDate))).getTime() > 0 ? new Date(parseInt(query.fromDate)) : new Date(date.getFullYear(), date.getMonth(), 1);
    const toDate = (new Date(parseInt(query.toDate))).getTime() > 0 ? new Date(parseInt(query.toDate)) : new Date();

    try {
        if(
            (!enumOrderStatus.includes(status) && status) ||
            (!enumOrderCreatedBy.includes(createdBy) && createdBy)
        ){
            return res.status(400).json({message: 'Status invalid'});
        }else{
            const statusCondition = !status ? {} : { status };
            const createdByCondition = !createdBy ? {} : { createdBy };
            const orderCodeCondition = !orderCode ? {} : { code: orderCode };
            const createdAtCondition = {
                createdAt: {
                    $gte: fromDate, 
                    $lt: toDate
                }
            }
            const phoneNumberCondition = !phoneNumber ? {} : { 'deliverTo.phoneNumber': phoneNumber };

            const condition = {
                ...statusCondition,
                ...createdByCondition,
                ...orderCodeCondition,
                ...createdAtCondition,
                ...phoneNumberCondition
            }
            const countTotalOrders = await Order.model.Order.countDocuments(condition);
            const filterPageOders = await Order.model.Order.find(
                condition,
                {
                    code: 1,
                    status: 1,
                    totalValue: 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            )
            .sort('-date')
            .skip((size * page) - size) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
            .limit(size);

            return res.status(200).json({
                totalItems: countTotalOrders,
                size: size,
                page: page,
                totalPages: Math.ceil(countTotalOrders/size),
                data: filterPageOders
            });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getDetail(req, res){
    const params = req.params;
    const orderId = params.orderId;

    try {
        if(!orderId){
            return res.status(400).json({message: 'Order Id is not found'});
        }else{
            const order = Order.model.Order.findOne(
                {
                    _id: orderId
                }
            );

            let populate = await populateOrder(order);
            return res.status(200).json(populate);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function revokeOrder(req, res){
    const params = req.params;
    const orderId = params.orderId;
    const formData = req.body;
    try {
        if(!orderId || (Object.keys(formData).length === 0 && formData.constructor === Object)){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const activity = {
                handledBy: 'admin',
                newStatus: 'revoke',
                comments: formData.comments
            }
            const orderIsRevoked = Order.model.Order.findOneAndUpdate(
                {
                    _id: orderId,
                    status: {
                        $nin: ['done', 'revoke']
                    }
                },
                {
                    $set: {
                        status: 'revoke'
                    },
                    $push: {
                        activities: activity
                    }
                },
                { 'new': true }
            )
            
            let populate = await populateOrder(orderIsRevoked);
            return res.status(200).json(populate);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function confirmOrder(req, res){
    const params = req.params;
    const orderId = params.orderId;
    try {
        if(!orderId){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const activity = {
                handledBy: 'admin',
                newStatus: 'confirmed',
            }

            const orderIsConfirmed = Order.model.Order.findOneAndUpdate(
                {
                    _id: orderId,
                    status: 'pending'
                },
                {
                    $set: {
                        status: 'confirmed'
                    },
                    $push: {
                        activities: activity
                    }
                },
                { 'new': true }
            );
    
            let populate = await populateOrder(orderIsConfirmed);
            return res.status(200).json(populate);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function isComing(req, res){
    const params = req.params;
    const orderId = params.orderId;
    const formData = req.body;

    try {
        if(
            !orderId ||
            (Object.keys(formData).length === 0 && formData.constructor === Object) ||
            !formData.shippingPartner.id ||
            !formData.shippingPartner.shippingFee ||
            isNaN(formData.shippingPartner.shippingFee)
        ){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const activity = {
                handledBy: 'admin',
                newStatus: 'isComing',
                shippingPartner: {
                    id: formData.shippingPartner.id,
                    shippingFee: formData.shippingPartner.shippingFee,
                }
            }
            const orderIsComing = Order.model.Order.findOneAndUpdate(
                {
                    _id: orderId,
                    status: 'confirmed'
                },
                {
                    $set: {
                        status: 'isComing',
                        shippingPartner: activity
                    },
                    $push: {
                        activities: activity
                    }
                },
                { 'new': true }
            );

            let populate = await populateOrder(orderIsComing);
            return res.status(200).json(populate);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function finish(req, res){
    const params = req.params;
    const orderId = params.orderId;
    try {
        if(!orderId){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            const activity = {
                handledBy: 'admin',
                newStatus: 'done',
            }
            const orderIsFinished = Order.model.Order.findOneAndUpdate(
                {
                    _id: orderId,
                    status: 'isComing'
                },
                {
                    $set: {
                        status: 'done'
                    },
                    $push: {
                        activities: activity
                    }
                },
                { 'new': true }
            );

            let populate = await populateOrder(orderIsFinished);
            return res.status(200).json(populate);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function createOrder(req, res){
    const formData = req.body;
    const decoded = req.jwtDecoded.data;
    const products = formData.products;
    const deliverTo = formData.deliverTo;
    try {
        if(
            !deliverTo ||
            (Object.keys(formData).length === 0 &&
            formData.constructor === Object) ||
            !products ||
            !products.length === 0
        ){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let accountId = await matchAdminAccount.getAccountId(decoded);
            if(!accountId){
                return res.status(400).json({message: 'Account not found'});
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

                let orderObj = {
                    status: 'confirmed',
                    code: orderCode,
                    accountId: accountId._id,
                    deliverTo: deliverTo,
                    products: [],
                    totalValue: 0,
                    createdBy: 'admin',
                    activities: [
                        {
                            handledBy: 'admin',
                            newStatus: 'confirmed',

                        }
                    ]
                }

                for(let i=0; i<products.length; i++){
                    let price = await productService.getProductPrice(products[i]._id, products[i].quantity);
                    if(price >= 0){
                        orderObj.totalValue += (products[i].quantity*price);
                    }else{
                        return res.status(404).json({message: 'Không tìm thấy sản phẩm'});
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
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function populateOrder(result){
    if(!result) return result;

    let populate = await result.populate(
        {
            path: 'products.productId',
            select: {
                name: 1,
                price: 1,
                thumbnailUrl: 1,
                category: 1
            }
        }
    )
    .populate(
        {
            path: 'accountId',
            select: {
                customerCode: 1,
                email: 1,
                phoneNumber: 1,
                name: 1
            }
        }
    );

    let newObject = populate.toObject();

    newObject.products = newObject.products.map(product=>{
        return {
            ...product.productId,
            quantity: product.quantity
        }
    });
    return newObject;
}

module.exports={
    getAll,
    getDetail,
    revokeOrder,
    confirmOrder,
    isComing,
    finish,
    createOrder
}