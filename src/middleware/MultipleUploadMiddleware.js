/**
 * Created by trungquandev.com's author on 17/08/2019.
 * multipleUploadMiddleware.js
 */
const util = require("util");
const multer = require("multer");
const fse = require('fs-extra');
const convertVie = require('../services/convert-Vie');
const localPathConfig = require('../config/local-path');
const imageAlbumService = require('../services/image-album');

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let storage = multer.diskStorage({
    // Định nghĩa nơi file upload sẽ được lưu lại
    destination: async(req, file, callback) => {
        let urlRoute = req.baseUrl + req.path;
        let query = req.query;

        let galleryFolder;
        switch(urlRoute){
            case '/admin/product-gallery/insert':
                let count = await imageAlbumService.checkExistAlbum(query.name);
                
                if(count){
                    console.log(count);
                    return callback({ code: 11000 }, null);
                }
                galleryFolder = 'product';
                break;
            case '/admin/product-gallery/update':
                galleryFolder = 'product';
                break;
            default: 
                galleryFolder = 'other';
                let error = {
                    code: 'UNSOPPORTED_FILE',
                    message: 'This route does not support files'
                }
                return callback(error, null);
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
// Bên trong hàm .array() truyền vào name của thẻ input, ở đây mình đặt là "many-files", và tham số thứ hai là giới hạn số file được phép upload mỗi lần, mình sẽ để là 17 (con số mà mình yêu thích). Các bạn thích để bao nhiêu cũng được.
let uploadManyFiles = multer({storage: storage}).array("many-files", 15);

// Mục đích của util.promisify() là để bên controller có thể dùng async-await để gọi tới middleware này
let multipleUploadMiddleware = util.promisify(uploadManyFiles);
module.exports = multipleUploadMiddleware;