const express = require("express");
const app = express();
const cors = require('cors');
const initRoutes = require("./routes/api");
const db = require('./config/db');


//Connect to Mongodb
db.connect();
// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());

app.use(cors());

// Khởi tạo các routes cho ứng dụng
initRoutes(app);
// chọn một port mà bạn muốn và sử dụng để chạy ứng dụng tại local
let port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at localhost:${port}/`);
});