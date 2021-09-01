const https = require('https');
const fse = require('fs-extra');
const express = require("express");
const app = express();
const cors = require('cors');
const passport = require('passport');

const applyPassportStrategy = require('./middleware/Passport');
const initRoutes = require("./routes/api");
const db = require('./config/db');

//Connect to Mongodb
db.connect();
// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());

app.use(cors());

applyPassportStrategy(passport);
// Khởi tạo các routes cho ứng dụng
initRoutes(app);
// chọn một port mà bạn muốn và sử dụng để chạy ứng dụng tại local

// const options = {
//     key: fse.readFileSync('./src/security/key.pem'),
//     cert: fse.readFileSync('./src/security/cert.pem')
// };

// https.createServer(options, app).listen(3000, 'localhost', () => {
//     console.log('Server is running at localhost: 3000');
// });

app.listen(3000, 'localhost', () => {
    console.log('Server is running at localhost: 3000');
});