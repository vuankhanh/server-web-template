const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminAccountSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        immutable: true,
        required: true
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    permission:  { type: Number, required: true, min: 1 }
},{
    timestamps: true,
});

const AdminAccount = mongoose.model('AdminAccount', adminAccountSchema, 'admin_accounts')

function adminRights(){
    return [
        {
            code: 1,
            name: 'Administrator'
        },{
            code: 2,
            name: 'Manager'
        },{
            code: 3,
            name: 'Collaborators'
        }
    ];
}

module.exports = {
    scheme: {
        adminAccountSchema
    },
    model:{
        AdminAccount
    },
    adminRights: adminRights(),
};