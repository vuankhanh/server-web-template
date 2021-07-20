const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./Address');
const config = require('../config/evironment');

let enumOrderStatus = config.order.orderStatus.map(status=>status.code);

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

module.exports = {
    scheme: {
        OrderShema
    },
    model:{
        Order
    }
}