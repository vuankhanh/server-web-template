const jwtHelper = require("../helpers/jwt.helper");

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let isAuth = async (req, res, next) => {
    // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
    if (tokenFromClient) {
        // Nếu tồn tại token
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await jwtHelper.verifyToken(req.originalUrl, tokenFromClient, accessTokenSecret);
            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
            req.jwtDecoded = decoded;

            // Cho phép req đi tiếp sang controller.
            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
}

async function checkSecureSocket (socket, next) {
    // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
    if (socket.handshake.query && socket.handshake.query['x-access-token']){
        try{

            const token = socket.handshake.query['x-access-token'];
            const decoded = await jwtHelper.verifyToken('socketSecure', token, accessTokenSecret);
            socket.decoded = decoded;
            next();
        }catch(err){
            next(new Error('Authentication error'));
        }
    }
    else {
        next(new Error('Authentication error'));
    }
    
}

module.exports = {
    isAuth,
    checkSecureSocket
};