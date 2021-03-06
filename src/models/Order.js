const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./Address');

let enumOrderStatus = orderStatus().map(status=>status.code);
let enumOrderCreatedBy = orderCreatedBy().map(createdBy=>createdBy.code);

const ProductSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, required: true }
});

const activitySchema = new Schema({
    handledBy: {
        type: String,
        enum: enumOrderCreatedBy,
        required: true
    },
    newStatus: {
        type: String,
        enum: enumOrderStatus,
        required: true
    },
    comments: {
        type: String,
        required: function(){
            return this.status === 'revoke';
        }
    },
    shippingPartner: {
        type: {
            id: { type: String, required: true },
            shippingFee: { type: Number, required: true }
        },
        required: function(){
            return this.status === 'isComing';
        }
    }
})

const OrderShema = new Schema({
    code: { type: String, unique: true, require: true },
    status: {
        type: String,
        enum: enumOrderStatus,
        default: enumOrderStatus[1],
        required: true
    },
    accountId: { type: Schema.Types.ObjectId, ref: 'ClientAuthentication', required: true },
    products: { type: [ProductSchema], required: true },
    deliverTo: { type: AddressSchema, required: true },
    totalValue: { type: Number, require: true },
    createdBy: {
        type: String,
        enum: enumOrderCreatedBy,
        required: true
    },
    activities: {
        type: [activitySchema],
        default: [],
        required: true
    },
    shippingPartner: {
        type: {
            id: { type: String, required: true },
            shippingFee: { type: Number, required: true }
        },
        required: function(){
            return this.status === 'isComing';
        }
    }
},{
    timestamps: true,
});
 
const Order = mongoose.model('Order', OrderShema, 'order');

function orderStatus(){
    return [
        {
            numericalOrder: 0,
            code: 'revoke',
            name: '???? h???y'
        },{
            numericalOrder: 1,
            code: 'pending',
            name: 'Ch??? x??c nh???n'
        },{
            numericalOrder: 2,
            code: 'confirmed',
            name: '??ang x??? l??'
        },{
            numericalOrder: 3,
            code: 'isComing',
            name: '??ang v???n chuy???n'
        },{
            numericalOrder: 4,
            code: 'done',
            name: 'Giao h??ng th??nh c??ng'
        },
    ]
}

function orderCreatedBy(){
    return [
        {
            numericalOrder: 0,
            code: 'customer',
            name: 'Ng?????i d??ng'
        },{
            numericalOrder: 1,
            code: 'admin',
            name: 'Admin'
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
    orderStatus: orderStatus(),
    orderCreatedBy: orderCreatedBy()
}