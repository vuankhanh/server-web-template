const statusSSM = [
    { code: 1, message: "Ready" },
    { code: 2, message: "Success" },
    { code: 3, message: "Unsuccessful" },
    { code: 4, message: "Cancelled" },
];
function sendSMS(req, res){
    let object = {
        id: "ssm-02022",
        phoneNumber: "0123456789",
        status: statusSSM[0].code
    }
    req.ioSecure.emit('send-ssm', object);
    return res.status(200).json(object);
}

module.exports = {
    sendSMS
}