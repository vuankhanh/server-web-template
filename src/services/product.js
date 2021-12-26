const Product = require('../models/Product');

async function checkProductsAvailable(products){
    try {

        let ids = products.filter(id=>id._id).map(id=>id._id);

        if(ids.length < products.length){
            let filteredResult = products.filter(product => {
                if(product._id){
                    return !ids.some(id => product._id === id)
                }
                return true;
            });
            return { status: -1 };
        }else{
            let condition = { _id: { $in: ids } };
    
            let productResult = await Product.model.Product.find(
                condition,
                { theRemainingAmount: 1 }
            );

            if(productResult.length < ids.length){
                let filteredResult = ids.filter(id=> !productResult.some(product=> product._id.toString() === id.toString()));
                return {
                    status: -1,
                    idsNotFound: filteredResult
                }
            }else{
                let theProductIsNotAvailable = [];
                for(let i=0; i<=products.length-1; i++){
                    let product = products[i];

                    let index = productResult.findIndex(pResult=>pResult._id.toString() === product._id);

                    if(product.quantity > productResult[index].theRemainingAmount){
                        theProductIsNotAvailable.push(product);
                    }
                }
                
                return {
                    status: 1,
                    theProductIsNotAvailable
                }
            }
        }
    } catch (error) {
        return { status: -1 };
    }
}

async function reduceProductTheRemainingAmount(products){
    //Khai báo biến đến hứng giá trị chỉ mục đã được trừ giá trị theRemainingAmount
    let indexLooped;
    let totalValue = 0;
    try {
        let productsHaveBeenChanged = [];
        for(let i=0; i<=products.length-1; i++){
            let product = products[i];

            let condition = { _id: product._id };

            let productResult = await Product.model.Product.findOne(
                condition,
                {
                    theRemainingAmount: 1,
                    price: 1
                }
            );
            
            //Cộng dồn số tiền từng sản phẩm*số lượng để ra tổng số tiền
            let price = productResult.price;
            
            if(price != undefined || price != null || !isNaN(price)){
                totalValue += (product.quantity*price);
            }else{
                return { status: -1 };
            }

            //Trừ số lượng còn lại trong CSDL
            productResult.theRemainingAmount = productResult.theRemainingAmount - product.quantity;
            await productResult.save();
            productsHaveBeenChanged.push(productResult);

            //Gán giá trị chỉ mục đã được duyệt qua
            indexLooped = i;
        }

        return {
            status: 1,
            totalValue,
            productsHaveBeenChanged
        };

    } catch (error) {
        // Cộng lại theRemainingAmount cho những Product được trừ thành công.
        if(indexLooped >=0){
            for(let i=0; i<=indexLooped; i++){
                let product = products[i];
                let condition = { _id: product._id };
                await Product.model.Product.findOneAndUpdate(
                    condition,
                    { $inc: { theRemainingAmount: product.quantity } },
                    {
                        new: true
                    }
                );
            }
        }

        return { status: -1 };
    }
}

async function getTheRemainingAmoutFollowIds(ids){
    try {
        let condition = { _id: { $in: ids } };
        let productResult = await Product.model.Product.find(
            condition,
            { theRemainingAmount: 1 }
        );
        return {
            status: 1,
            data: productResult
        }
    } catch (error) {
        return {
            status: -1,
            data: []
        }
    }
    
}

module.exports = {
    checkProductsAvailable,
    reduceProductTheRemainingAmount,
    getTheRemainingAmoutFollowIds
}