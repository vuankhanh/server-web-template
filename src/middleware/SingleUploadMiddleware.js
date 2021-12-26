/**
 * Created by trungquandev.com's author on 17/08/2019.
 * multipleUploadMiddleware.js
 */
const util = require("util");
const multer = require("multer");
const fse = require('fs-extra');
const convertVie = require('../services/convert-Vie');
const localPathConfig = require('../config/local-path');

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let storage = multer.diskStorage({
    // Định nghĩa nơi file upload sẽ được lưu lại
    destination: (req, file, callback) => {
        let urlRoute = req.baseUrl + req.path;
        let query = req.query;

        let galleryFolder;
        switch(urlRoute){
            case '/admin/banner-gallery/insert':
            case '/admin/banner-gallery/update':
                galleryFolder = 'banner';
            case '/admin/identification/logo/insert':
            case '/admin/identification/logo/update':
                galleryFolder = 'identification';
        }

        try {
            fse.ensureDirSync(localPathConfig.gallery+'/'+galleryFolder+'/'+convertVie(query.name));
            return callback(null, localPathConfig.gallery+'/'+galleryFolder+'/'+convertVie(query.name));
        } catch (error) {
            return callback(null, error);
        }
    },
    filename: (req, file, callback) => {
        // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
        // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
        let query = req.query;
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        // Tên của file thì mình nối thêm một cái nhãn thời gian để tránh bị trùng tên file.
        let filename = `${Date.now()}-${convertVie(query.name)}-${file.originalname}`;

        callback(null, filename);
    }
});
// Khởi tạo middleware uploadManyFiles với cấu hình như ở trên,
let uploadSingleFile = multer({storage: storage}).single("single-file");

// Mục đích của util.promisify() là để bên controller có thể dùng async-await để gọi tới middleware này
let multipleUploadMiddleware = util.promisify(uploadSingleFile);
module.exports = multipleUploadMiddleware;