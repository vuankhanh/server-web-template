const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enumReviewStatus = reviewStatus().map(status=>status.code);

const ProductReviewsSchema = new Schema({
    status: {
        type: String,
        enum: enumReviewStatus,
        default: enumReviewStatus[1],
        required: true
    },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    clientInformation: {
        type: {
            name: { type: String, required: true },
            phoneNumber: {
                type: String,
                validate: {
                    validator: function(v) {
                      return /((0)+([0-9]{9})\b)/g.test(v);
                    },
                    message: props => `${props.value} is not a valid phone number!`
                },
                required: true
            }
        },
        required: true
    },
    content: { type: String, require: true },
    rating: { type: Number, min: 1, max: 5 }
},{
    timestamps: true
});

const ProductReviews = mongoose.model('ProductReviews', ProductReviewsSchema, 'product_reviews');

function reviewStatus(){
    return [
        {
            numericalOrder: 0,
            code: 'revoke',
            name: 'Đã hủy'
        },{
            numericalOrder: 1,
            code: 'pending',
            name: 'Chờ xác nhận'
        },{
            numericalOrder: 2,
            code: 'confirmed',
            name: 'Đã xác nhận'
        }
    ]
}

function rating(){
    return [
        {
            value: 1,
            title: 'Rất không hài lòng'
        },{
            value: 2,
            title: 'Không hài lòng'
        },{
            value: 3,
            title: 'Bình thường'
        },{
            value: 4,
            title: 'Hài lòng'
        },{
            value: 5,
            title: 'Cực kì hài lòng'
        }
    ]
}

module.exports = {
    scheme: {
        ProductReviewsSchema
    },
    model: {
        ProductReviews
    },
    reviewStatus: reviewStatus(),
    rating: rating()
};