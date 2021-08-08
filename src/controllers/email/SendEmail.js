const nodemailer = require("nodemailer");
const config = require('../../config/email');

async function sendEmail(emailOfRecipient, subject, html){
    try {
        let transporter = nodemailer.createTransport(config);

        let info = await transporter.sendMail({
            from: '"CAROTA" <info@carota.vn>', // sender address
            to: emailOfRecipient, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        });
        // console.log("Message sent: %s", info.messageId);
        // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        return info.messageId;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    sendEmail
}