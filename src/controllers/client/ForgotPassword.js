const jwt = require("jsonwebtoken");
const path = require('path');
const handlebars = require('handlebars');
const fse = require('fs-extra');
const config = require('config');
const frontEndConfig = config.get('FrontEnd');
const backEndConfig = config.get('BackEnd');

const bcrypt = require("../../services/bcrypt");

const ClientAuthentication = require('../../models/ClientAuthentication');

const SendEmail = require('../email/SendEmail');
const templateUrl = path.join(__dirname, '../email/template/ForgotPassword.html');

// Thời gian sống của token
const forgotPasswordTokenLife = process.env.JWT_FORGOT_PASSWORD_TOKEN_LIFE;
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const forgotPasswordTokenSecret = process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET;

async function checkEmail(req, res){
    const formData = req.body;
    try {
        if(!formData.email){
            return res.status(400).json({message: 'Missing parameter'});
        }else{
            let condition = { email: formData.email };
            const clientInfo = await ClientAuthentication.findOne(condition);

            if(!clientInfo){
                return res.status(404).json({message: 'Not found email'});
            }else{
                if(clientInfo.account && clientInfo.account.userName){
                    if(clientInfo.account.isVerified != undefined && clientInfo.account.isVerified === false){
                        return res.status(205).json({message: 'this account is not activated yet'});
                    }

                    let tokenData = {
                        userName: clientInfo.account.userName,
                        email: clientInfo.email
                    };
    
                    let token = await generateToken(tokenData);
    
                    userData = {
                        userName: clientInfo.account.userName,
                        name: clientInfo.name,
                        email: clientInfo.email,
                        passwordToken: token
                    }
    
                    let templateData = {
                        frontEnd: frontEndConfig.app,
                        backEnd: backEndConfig.host,
                        userInfo: userData
                    }
                    const html = await readHTMLFile(templateData);
                    if(!html){
                        return res.status(500).json({ message: 'Something went wrong' });
                    }else{
                        let result = await SendEmail.sendEmail(userData.email, "Đặt lại mật khẩu", html);
                        return res.status(200).json({message: 'successfully'});
                    }
                }else{
                    return res.status(404).json({message: 'Not found User Name'});
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function checkToken(req, res){
    let token = req.headers["token"];
    if(!token){
        return res.status(500).send({message: 'No token provided.'});
    }else{
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await verifyToken(token);
            return res.status(200).json({message: 'Valid Token'});
        } catch (error) {
            return res.status(500).json({message: 'Invalid Token.'});
        }
    }
}

async function createNewPassword(req, res){
    const token = req.headers["token"];
    const formData = req.body;
    if(!token){
        return res.status(500).json({ message: 'Something went wrong' });
    }else{
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await verifyToken(token);
            if(!decoded.data.userName || !formData.newPassword){
                return res.status(400).json({message: 'Missing parameter'});
            }else{
                let condition = {
                    'account.userName': decoded.data.userName
                }
                const account = await ClientAuthentication.findOneAndUpdate(
                    condition,
                    {
                        $set: {
                            'password': bcrypt.hashPassword(formData.newPassword)
                        }
                    },
                    {new: true}
                );
                if(account){
                    return res.status(200).json({message: 'success'});
                }else{
                    return res.status(500).json({ message: 'Something went wrong' });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

async function generateToken(data){
    return new Promise((resolve, reject) => {
        // Thực hiện ký và tạo token
        jwt.sign(
            {data: data},
            forgotPasswordTokenSecret,
            {
                algorithm: "HS256",
                expiresIn: forgotPasswordTokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            }
        );
    })
}

let verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, forgotPasswordTokenSecret, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
}

async function readHTMLFile(data){
    try {
        const html = await fse.readFile(templateUrl, {encoding: 'utf-8'});
        const template = handlebars.compile(html);
        return template(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    checkEmail,
    checkToken,
    createNewPassword
}