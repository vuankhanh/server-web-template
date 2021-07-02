const jwt = require("jsonwebtoken");

/**
 * private function generateToken
 * @param user 
 * @param secretSignature 
 * @param tokenLife 
 */
let generateToken = (accountType, userInfor, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        console.log(accountType);
        // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
        const userData = (accountType === 'admin') ?
            {
                userName: userInfor.userName,
                name: userInfor.name,
                avatar: userInfor.avatar,
                permission: userInfor.permission,
                createdAt: userInfor.createdAt,
                updatedAt: userInfor.updatedAt,
            }:
            {
                userName: userInfor.userName,
                name: userInfor.name,
                email: userInfor.email,
                phoneNumber: userInfor.phoneNumber,
                customerCode: userInfor.customerCode,
                address: userInfor.address,
                createdAt: userInfor.createdAt,
                updatedAt: userInfor.updatedAt,
            }
        // Thực hiện ký và tạo token
        jwt.sign(
            {data: userData},
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            }
        );
    });
}

/**
 * This module used for verify jwt token
 * @param {*} token 
 * @param {*} secretKey 
 */
let verifyToken = (originalUrl, token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            let typeOfAccount = originalUrl.split("/");
            if((typeOfAccount && typeOfAccount[1])){
                if(
                    (typeOfAccount[1]==='admin' && decoded.data.permission) ||
                    (typeOfAccount[1]==='client' && decoded.data.customerCode)
                ){
                    resolve(decoded);
                }else reject();
            }
            else reject();
        });
    });
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
};