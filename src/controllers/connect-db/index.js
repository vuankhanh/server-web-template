const mongoose = require("mongoose");
const config = require('config');
const dbConfig = config.get('BackEnd');
const { db: { domain, port, name } } = dbConfig;

async function connect(){
    try {
        await mongoose.connect(`mongodb://${domain}:${port}/${name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Connect Mongodb successfully!!!");
    } catch (error) {
        console.log("Connect Mongodb failure!!!");
    }
}

module.exports = {
    connect
}