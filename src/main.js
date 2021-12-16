// const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: './dotenv/.env'});

const express = require("express");
const app = express();
const cors = require('cors');
const passport = require('passport');
const socket = require("socket.io");

const applyPassportStrategy = require('./middleware/Passport');
const initRoutes = require("./routes/api");
const db = require('./controllers/connect-db');
const connectSocket = require('./controllers/socket-process');

//Connect to Mongodb
db.connect();
// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());

app.use(cors());

//Áp dụng mildleware cho 
applyPassportStrategy(passport);

const server = app.listen(3000, 'localhost', () => {
    console.log('Server is running at localhost: 3000');
});

// Socket setup
const io = socket(server, {
    path: '/ws/',
    cors: {
        origin: '*',
        credentials:true
    }
});
connectSocket(io);

// Khởi tạo các routes cho ứng dụng
initRoutes(app, io);