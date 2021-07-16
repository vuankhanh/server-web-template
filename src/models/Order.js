const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/evironment');

const ProductSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number, default: 1 }
})

const OrderShema = new Schema({
    code: { type: String, unique: true, require: true },
    status: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'isComing',
            'done',
            'revoke'
        ],
        default: 'pending'
    },
    accountId: { type: Schema.Types.ObjectId, ref: 'client_accounts' },
    products: { type: [ProductSchema], required: true}
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