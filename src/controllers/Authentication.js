const process = require('../config/evironment/index');
const jwtHelper = require("../helpers/jwt.helper");
const adminAccount = require('../services/matchAdminAccount');
const clientAccount = require('../services/matchClientAccount');
const debug = console.log.bind(console);

// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};

// Thời gian sống của token
const accessTokenLife = process.token.authentication.REFRESH_TOKEN_LIFE;
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.token.authentication.ACCESS_TOKEN_SECRET;

// Thời gian sống của refreshToken
const refreshTokenLife = process.token.authentication.REFRESH_TOKEN_LIFE;
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.token.authentication.REFRESH_TOKEN_SECRET;

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let login = async (req, res) => {
    try {
        const originalUrl = req.originalUrl;
        let typeOfAccount = originalUrl.split("/");
        let matchedAccount;
        if(typeOfAccount.length>0 && typeOfAccount[1]){
            console.log(typeOfAccount[1]);
            if(typeOfAccount[1]==='admin'){
                matchedAccount = await adminAccount(req.body);
            }else if(typeOfAccount[1]==='client'){
                matchedAccount = await clientAccount.checkAccount(req.body);
            }
        }
        if(matchedAccount){
            if(matchedAccount.isVerified != undefined && matchedAccount.isVerified === false){
                return res.status(205).json({message: 'this account is not activated yet'});
            }

            debug(`Thực hiện tạo mã Token, [thời gian sống 30 ngày.]`);
            const accessToken = await jwtHelper.generateToken(typeOfAccount[1], matchedAccount, accessTokenSecret, accessTokenLife);
            
            const refreshToken = await jwtHelper.generateToken(typeOfAccount[1], matchedAccount, refreshTokenSecret, refreshTokenLife);
    
            // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
            // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
            tokenList[refreshToken] = { accessToken, refreshToken };
            
            return res.status(200).json({accessToken, refreshToken, message: 'successfully'});
        }else{
            return res.status(403).json({message: 'Sai tên đăng nhập hoặc mật khẩu'});
        }
    } catch (error) {
        console.log(error);
        console.log('Token hết hạn');
        return res.status(500).json(error);
    }
}

/**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
let refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        const originalUrl = req.originalUrl;
        let typeOfAccount = originalUrl.split("/");
        console.log(typeOfAccount);
        console.log(originalUrl);
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            const decoded = await jwtHelper.verifyToken(originalUrl, refreshTokenFromClient, refreshTokenSecret);

            // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
            // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
            // debug("decoded: ", decoded);
            const userFakeData = decoded.data;

            debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 30 ngày.]`);
            const accessToken = await jwtHelper.generateToken(typeOfAccount[1], userFakeData, accessTokenSecret, accessTokenLife);

            // gửi token mới về cho người dùng
            return res.status(200).json({accessToken});
        } catch (error) {
            // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
            debug(error);

            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
};

module.exports = {
    login: login,
    refreshToken: refreshToken,
}