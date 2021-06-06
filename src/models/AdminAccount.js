const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminAccountSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    permission:  { type: Number, required: true }
},{
    timestamps: true,
});

var AdminAccount = mongoose.model('AdminAccount', adminAccountSchema, 'admin_accounts')

module.exports = AdminAccount;