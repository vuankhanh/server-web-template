const Order = require('../../models/Order');
const matchClientAccount = require('../../services/matchClientAccount');

const nextSequenceCode = require('../../services/nextSequenceCode');
const productService = require('../../services/product');


async function getAll(req, res){
    try {
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.email);
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
                    status: 1,
                    totalValue: 1,
                    createdBy: 1,
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
            
            let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.email);
            if(!accountId._id){
                return res.status(400).json({message: 'Account not found'});
            }else{
                let orderDetail = await Order.model.Order.findById(orderId)
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
    const userInfo = req.jwtDecoded.data;
    const formData = req.body;

    const products = formData.products;
    try {
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.email);
        if(!accountId._id){
            return res.status(400).json({message: 'Account not found'});
        }else{
            if(!products || !products.length>0){
                return res.status(400).json({message: 'Missing parameter'});
            }else{

                let checkProductsAvailable = await productService.checkProductsAvailable(products);
                if(checkProductsAvailable.status === -1){
                    //Lỗi những id này không tìm thấy
                    
                    if(!checkProductsAvailable.idsNotFound){
                        console.log('Đã có lỗi xảy ra');
                        return res.status(400).json({message: 'Missing ID parameter'});
                    }else{
                        console.log('Danh sách id không thấy document');
                        console.log(checkProductsAvailable.idsNotFound);
                        return res.status(404).json(
                            {
                                message: 'Missing parameter',
                                data: checkProductsAvailable.idsNotFound
                            }
                        );
                    }
                }else{
                    let notAvailable = checkProductsAvailable.theProductIsNotAvailable;
                    
                    //Những sản phẩm không còn đủ
                    if(notAvailable.length>0){
                        console.log('Những sản phẩm không còn đủ');
                        console.log(notAvailable);
                        return res.status(404).json(
                            {
                                message: 'Out of stock',
                                data: notAvailable
                            }
                        );
                    }else{
                        console.log('Tất cả sản phẩm đều có sẵn');

                        //Chạy tiếp hàm trừ số lượng của sản phẩm
                        let reduceProductTheRemainingAmount = await productService.reduceProductTheRemainingAmount(products);

                        if(reduceProductTheRemainingAmount.status === -1){
                            return res.status(404).json(
                                {
                                    message: 'Out of stock',
                                    data: notAvailable
                                }
                            );
                        }else{
                            let totalValue = reduceProductTheRemainingAmount.totalValue;
                            let productsHaveBeenChanged = reduceProductTheRemainingAmount.productsHaveBeenChanged;

                            //Tạo mã đơn hàng
                            let orderCode = '';
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
                            
                            //Tạo Object để chuẩn bị ghi vào CSDL
                            let orderObj = {
                                code: orderCode,
                                accountId: accountId._id,
                                deliverTo: formData.deliverTo,
                                products,
                                totalValue,
                                createdBy: 'customer'
                            }
                            
                            const order = new Order.model.Order(orderObj);
                            await order.save();
                            
                            productsHaveBeenChanged.forEach(product=>{
                                let socketData = {
                                    email: userInfo.email,
                                    product
                                }
                                req.io.emit('product-quantity', socketData);
                            });
                            
                            return res.status(200).json(order);
                        }
                    }
                }
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
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.email);
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