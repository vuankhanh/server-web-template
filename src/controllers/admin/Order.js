const Order = require('../../models/Order');
const enumOrderStatus = Order.orderStatus.map(status=>status.code);
const enumOrderCreatedBy = Order.orderCreatedBy.map(createdBy=>createdBy.code);

async function getAll(req, res){
    const query = req.query;
    
    const size = parseInt(query.size) || 10;
    const page = parseInt(query.page) || 1;
    const status = query.status;
    const createdBy = query.createdBy;
    const orderCode = query.orderCode;

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

            const condition = {
                ...statusCondition,
                ...createdByCondition,
                ...orderCodeCondition
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
        console.log(error);
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
            const order = await Order.model.Order.findById(orderId)
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
            )
            .map(res=> res ? res.toObject() : res);
            
            order.products = order.products.map(product=>{
                return {
                    ...product.productId,
                    quantity: product.quantity
                }
            })
            // console.log(orderNice);
            return res.status(200).json(order);
        }
    } catch (error) {
        console.log(error);
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
            const orderIsRevoked = await Order.model.Order.findOneAndUpdate(
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
            )

            if(!orderIsRevoked){
                return res.status(200).json(orderIsRevoked);
            }
            
            let newObject = orderIsRevoked.toObject();
            console.log(newObject);
            newObject.products = newObject.products.map(product=>{
                return {
                    ...product.productId,
                    quantity: product.quantity
                }
            });
            return res.status(200).json(newObject);
        }
    } catch (error) {
        console.log(error);
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

            const orderIsConfirmed = await Order.model.Order.findOneAndUpdate(
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
    
            return res.status(200).json(orderIsConfirmed);
        }
    } catch (error) {
        console.log(error);
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
            !formData.shippingPartner.shippingFee
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
            const orderIsConfirmed = await Order.model.Order.findOneAndUpdate(
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
    
            return res.status(200).json(orderIsConfirmed);
        }
    } catch (error) {
        console.log(error);
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
            const orderIsConfirmed = await Order.model.Order.findOneAndUpdate(
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
    
            return res.status(200).json(orderIsConfirmed);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function createOrder(req, res){
    const formData = req.body;
    console.log(formData);
    try {
        if(Object.keys(formData).length === 0 && formData.constructor === Object){
            return res.status(400).json({message: 'Missing parameter'});
        }else{

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
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