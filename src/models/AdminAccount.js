const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminAccountSchema = new Schema({
    userName: { type: String },
    password: { type: String },
    name: { type: String },
    avatar: { type: String },
    permission:  { type: Number }
});

var AdminAccount = mongoose.model('AdminAccount', adminAccountSchema, 'admin_accounts')

module.exports = AdminAccount;