//Controller
const EstimateFee = require('../shipping-partner/ahamove/estimate-fee');

//Model
const Product = require('../../models/Product');

//Serice
const discountService = require('../../services/discount');

async function totalBill(req, res){
    const formData = req.body;

    const cart = formData.cart;

    try {
        if(!cart || cart.length === 0){
            return res.status(400).json({message: 'Missing parameter'}); 
        }else{
            let priceOfProducts = await findProducts(cart);
            if(!priceOfProducts || priceOfProducts.length === 0){
                return res.status(404).json({message: 'Tham số có chứa ID không đúng'});
            }else{
                let totalPrice = summationPrice(priceOfProducts);
                
                let discount = discountService.discount(totalPrice);
                return res.status(200).json({ totalBill: discount });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function estimateFee(req, res){
    const formData = req.body;

    const userInfo = req.jwtDecoded;
    const addressId = formData.addressId;
    const cart = formData.cart;
    try {
        if(!cart || cart.length === 0){
            return res.status(400).json({message: 'Missing parameter'}); 
        }else{
            let priceOfProducts = await findProducts(cart);
            if(!priceOfProducts || priceOfProducts.length === 0){
                return res.status(404).json({message: 'Tham số có chứa ID không đúng'});
            }else{
                let totalPrice = summationPrice(priceOfProducts);
                console.log(userInfo);
                console.log(addressId);
                console.log(totalPrice);
                EstimateFee.calculator(res, userInfo, addressId, totalPrice);
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

//Tìm các sản phẩm theo danh sách trong giỏ hàng
async function findProducts(cart){
    try {
        let cleanArray = mergeProductDuplicateInCart(cart);
        const ids = cleanArray.filter(product=>product._id);
        if(ids.length != cleanArray.length){
            return false;
        }else{
            let priceOfProducts = await Product.model.Product.find(
                {
                    _id: {
                        $in: ids
                    }
                },{
                    price: 1
                }
            );
            return mapResultFindProduct(cleanArray, priceOfProducts);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Gộp các trường có id trùng lặp trong mảng Giỏ hàng
function mergeProductDuplicateInCart(cart){
    const result = [];
    let obj = {};
    for(let product of cart){
        if(obj[product._id]){
            obj[product._id] += product.quantity;
        }else{
            obj[product._id] = product.quantity;
        }
    }

    for(const [key, value] of Object.entries(obj)){
        result.push({ _id: key, quantity: value });
    }

    return result;
}

//Gắn lại mảng Giỏ hàng sau khi lấy được giá từ CSDL
function mapResultFindProduct(cleanArray, resultFindProduct){
    return cleanArray.map(cArray=>{
        let index = resultFindProduct.findIndex(result=>result._id.toString() === cArray._id.toString());
        return { ...cArray, price: resultFindProduct[index].price };
    });
}

//Tính tổng giá trị của giỏ hàng
function summationPrice(products){
    let total = 0;
    for(let product of products){
        total += (product.price*product.quantity);
    }
    return total;
}

module.exports = {
    totalBill,
    estimateFee
}