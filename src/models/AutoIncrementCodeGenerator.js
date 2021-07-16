const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoIncrementCodeGeneratorSchema = new Schema({
    userCode: { type: Number, require: true },
    productCode: { type: Number, require: true },
    orderCode: { type: Number, require: true }
},{
    timestamps: true,
    capped: true,
    size: 1024,
    max: 1,
    autoIndexId: true
});

const AutoIncrementCodeGenerator = mongoose.model('AutoIncrementCodeGenerator', AutoIncrementCodeGeneratorSchema, 'auto_increment_code_generator');

module.exports = {
    schema: {
        AutoIncrementCodeGeneratorSchema
    },
    model:{
        AutoIncrementCodeGenerator
    }
}