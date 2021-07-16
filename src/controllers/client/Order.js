const config = require('../../config/evironment');
const Order = require('../../models/Order');
const matchClientAccount = require('../../services/matchClientAccount');

const nextSequenceCode = require('../../services/nextSequenceCode');

const deliveryStatus = config.order;

async function getAll(req, res){
    try {
        console.log(req.jwtDecoded);
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.userName);
        if(!accountId._id){
            res.status(400).json({message: 'Account not found'});
        }else{
            res.status(200).json(accountId);

        }
    } catch (error) {
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
                res.status(400).json({message: 'Missing parameter'});
            }else{
                let orderCode = ''
                let nextSequenceOrderCode = await nextSequenceCode.getNextSequence('orderCode');
                if(nextSequenceOrderCode && nextSequenceOrderCode.orderCode){
                    orderCode = nextSequenceCode.padWithZero(nextSequenceOrderCode.orderCode);
                    console.log(orderCode);
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
                    products: []
                }
                for(let i=0; i<products.length; i++){
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

async function update(req, res){
    try {
        console.log(req.jwtDecoded);
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.userName);
        if(!accountId._id){
            res.status(400).json({message: 'Account not found'});
        }else{
            res.status(200).json(accountId);

        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function revoke(req, res){
    try {
        console.log(req.jwtDecoded);
        let accountId = await matchClientAccount.getAccountId(req.jwtDecoded.data.userName);
        if(!accountId._id){
            res.status(400).json({message: 'Account not found'});
        }else{
            res.status(200).json(accountId);

        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    getAll,
    insert,
    update,
    revoke,
}