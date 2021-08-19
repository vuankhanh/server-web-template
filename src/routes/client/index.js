const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");

const Auth = require('../../controllers/Authentication');
const PassportFacebook = require('../../controllers/client/FacebookPassport');
const PassportGoogle = require('../../controllers/client/GooglePassport');
const Config = require("../../controllers/Config");
const Register = require('../../controllers/client/Register');
const SendEmail = require('../../controllers/email/SendEmail');
const ForgotPassword = require('../../controllers/client/ForgotPassword');

const ProductCategory = require('../../controllers/client/ProductCategory');
const Product = require('../../controllers/client/Product');
const Order = require('../../controllers/client/Order');
const ShippingPartner = require('../../controllers/client/ShippingPartner');

const CheckExistsUserName = require('../../controllers/client/CheckExistsAccount');
const UpdateInformation = require('../../controllers/client/UpdateInformation');
const AdministrativeUnits = require('../../controllers/client/AdministrativeUnits');
const CustomerAddress = require('../../controllers/client/CustomerAddress');
const EstimateShippingFee = require('../../controllers/shipping-partner/ahamove/estimate-fee');

router.get("/");

router.get("/config", Config);

router.post("/login", Auth.login);
router.post('/auth-facebook', PassportFacebook.auth);
router.post('/auth-google', PassportGoogle.auth);
router.post("/refresh-token", Auth.refreshToken);
router.post("/check-user-name", CheckExistsUserName.checkExistsUserName);
router.post("/check-email", CheckExistsUserName.checkExistsEmail);
router.post('/register', Register.register);
router.get('/verify-email', Register.verifyEmail);
router.post('/forgot-password/check-email', ForgotPassword.checkEmail);
router.get('/forgot-password/check-token', ForgotPassword.checkToken);
router.post('/forgot-password/new-password', ForgotPassword.createNewPassword);

router.get("/product-category", ProductCategory);
router.get("/product-hightlight", Product.getProductHightlight);
router.get("/product", Product.getAll);
router.get("/product/:_id", Product.getDetail);

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

// List Protect APIs:
router.get("/check", (req, res)=>{
    return res.status(200).json({message: 'success'});
});


router.put("/update-customer", UpdateInformation);

router.get("/administrative-units", AdministrativeUnits.province);
router.get("/administrative-units/:provinceCode/district", AdministrativeUnits.district);
router.get("/administrative-units/:districtCode/ward", AdministrativeUnits.ward);

router.get("/customer/address", CustomerAddress.address);
router.post("/customer/address/insert", CustomerAddress.insert);
router.put("/customer/address/update", CustomerAddress.update);
router.put("/customer/address/remove", CustomerAddress.remove);

router.post('/customer/esimate-shipping-fee', EstimateShippingFee.estimateFee);

router.get('/order', Order.getAll);
router.get('/order/:_id', Order.getDetail);
router.post('/order/insert', Order.insert);
// router.put('/order/update', Order.update);
router.post('/order/revoke', Order.revoke);

router.get('/order/shipping/estimate', ShippingPartner.astimateShippingFee)

module.exports = router;