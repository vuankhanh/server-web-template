// const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: './dotenv/.env'});

const express = require("express");
const app = express();
const cors = require('cors');
const passport = require('passport');

const applyPassportStrategy = require('./middleware/Passport');
const initRoutes = require("./routes/api");
const db = require('./controllers/connect-db');

//Connect to Mongodb
db.connect();
// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());

app.use(cors());

applyPassportStrategy(passport);
// Khởi tạo các routes cho ứng dụng
initRoutes(app);

app.listen(3000, 'localhost', () => {
    console.log('Server is running at localhost: 3000');
});