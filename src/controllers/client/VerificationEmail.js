const path = require('path');
const handlebars = require('handlebars');
const fse = require('fs-extra');
const SendEmail = require('../email/SendEmail');
const templateUrl = path.join(__dirname, '../email/template/VerifyEmail.html');
const config = require('config');
const frontEndConfig = config.get('FrontEnd');
const { app } = frontEndConfig;

async function verificationEmail(clientInfo){
    try {
        if(!clientInfo){
            return null;
        }else{
            let templateData = {
                host: app,
                userInfo: clientInfo
            }
            const html = await readHTMLFile(templateData);
            if(!html){
                return null;
            }else{
                let result = await SendEmail.sendEmail(clientInfo.email, "Xác thực email của bạn", html);
                return result;
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function readHTMLFile(data){
    try {
        const html = await fse.readFile(templateUrl, {encoding: 'utf-8'});
        const template = handlebars.compile(html);
        return template(data);
    } catch (error) {
        return null;
    }
}

module.exports = {
    verificationEmail
}