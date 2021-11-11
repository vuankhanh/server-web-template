const productService = require('../../services/product');

module.exports = (socket)=>{
    socket.on('refresh-the-remaining-amount-products', async(ids)=>{
        let result = await productService.getTheRemainingAmoutFollowIds(ids);
        console.log(result.data);
        if(result.data){
            console.log(result.data);
            socket.emit('the-remaining-amount-products-after-refresh', result.data);
        }
    })
}