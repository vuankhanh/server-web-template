const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    productReviews: { type: Schema.Types.ObjectId, ref: 'ProductReviews' },
    clientInformation: {
        type: {
            name: { type: String, required: true },
            phoneNumber: { type: String, required: true }
        },
        required: true
    },
    content: { type: Object, require: true }
},{
    timestamps: true
});

const Comment = mongoose.model('Comment', CommentSchema, 'comment');

module.exports = {
    scheme: {
        CommentSchema
    },
    model: {
        Comment
    }
};