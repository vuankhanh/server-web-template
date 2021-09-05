const mongoose = require("mongoose");
const config = require('config');
const dbConfig = config.get('BackEnd');
const { db: { domain, port, name } } = dbConfig;
const ClientAuthentication = require('./src/models/ClientAuthentication');

async function connect(){
    try {
        await mongoose.connect(`mongodb://${domain}:${port}/${name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Connect Mongodb successfully!!!");
        const result = await ClientAuthentication.findOne(
            {
                $or: [
                    {
                        email: 'vuankhan071992@gmail.com'
                    },
                    {
                        'account.userName': 'vuankhanh'
                    }
                ]
            }
        );
        console.log(result);
    } catch (error) {
        console.log("Connect Mongodb failure!!!");
    }
}

connect()


