const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./Address');

let enumOrderStatus = orderStatus().map(status=>status.code);

const ProductSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
})

const OrderShema = new Schema({
    code: { type: String, unique: true, require: true },
    status: {
        type: String,
        enum: enumOrderStatus,
        default: enumOrderStatus[0]
    },
    accountId: { type: Schema.Types.ObjectId, ref: 'client_accounts' },
    products: { type: [ProductSchema], required: true },
    deliverTo: { type: AddressSchema, required: true },
    totalValue: { type: Number, require: true }
},{
    timestamps: true,
});
 
const Order = mongoose.model('Order', OrderShema, 'order');

function orderStatus(){
    return [
        {
            numericalOrder: 1,
            code: 'pending',
            name: 'Chờ xác nhận'
        },{
            numericalOrder: 2,
            code: 'confirmed',
            name: 'Đang xử lý'
        },{
            numericalOrder: 3,
            code: 'isComing',
            name: 'Đang vận chuyển'
        },{
            numericalOrder: 4,
            code: 'done',
            name: 'Giao hàng thành công'
        },{
            numericalOrder: 5,
            code: 'revoke',
            name: 'Đã hủy'
        }
    ]
}

module.exports = {
    scheme: {
        OrderShema
    },
    model:{
        Order
    },
    orderStatus: orderStatus()
}