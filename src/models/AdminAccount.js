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
    avatar: { type: String },
    permission:  { type: Number, required: true, min: 1 },
    activated: { type: Boolean, require: true, default: true }
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
        },{
            code: 4,
            name: 'SatelliteSystem'
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