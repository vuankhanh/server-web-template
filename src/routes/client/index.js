const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");

const Auth = require('../../controllers/Authentication');
const SocialAuthentication = require('../../controllers/client/SocialAuthentication');
const Config = require("../../controllers/Config");
const Register = require('../../controllers/client/Register');
const SendEmail = require('../../controllers/email/SendEmail');
const ForgotPassword = require('../../controllers/client/ForgotPassword');

const ProductCategory = require('../../controllers/client/ProductCategory');
const Product = require('../../controllers/client/Product');
const Cart = require('../../controllers/client/Cart');
const AdministrativeUnits = require('../../controllers/AdministrativeUnits');
const OrderFromVisitors = require('../../controllers/client/OrderFromVisitors');

const CheckExistsUserName = require('../../controllers/client/CheckExistsAccount');
const UpdateInformation = require('../../controllers/client/UpdateInformation');
const CustomerAddress = require('../../controllers/client/CustomerAddress');
const EstimateShippingFee = require('../../controllers/shipping-partner/ahamove/estimate-fee');
const Order = require('../../controllers/client/Order');

router.get("/");

router.get("/config", Config);

router.post("/login", Auth.login);
router.post('/auth-facebook', SocialAuthentication.Facebook);
router.post('/auth-google',  SocialAuthentication.Google);
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
router.get("/product/:route", Product.getDetail);

router.post('/cart/total-bill', Cart.totalBill);

router.get("/administrative-units", AdministrativeUnits.province);
router.get("/administrative-units/:provinceCode/district", AdministrativeUnits.district);
router.get("/administrative-units/:districtCode/ward", AdministrativeUnits.ward);

router.post("/order-from-visitors/insert", OrderFromVisitors.insert);

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

// List Protect APIs:
router.get("/check", (req, res)=>{
    return res.status(200).json({message: 'success'});
});

router.put("/update-customer", UpdateInformation);

router.get("/customer/address", CustomerAddress.address);
router.post("/customer/address/insert", CustomerAddress.insert);
router.put("/customer/address/update", CustomerAddress.update);
router.put("/customer/address/remove", CustomerAddress.remove);

router.post('/customer/estimate-shipping-fee', EstimateShippingFee.estimateFee);

router.post('/cart/estimate-shipping-fee', Cart.estimateFee );

router.get('/order', Order.getAll);
router.get('/order/:_id', Order.getDetail);
router.post('/order/insert', Order.insert);
// router.put('/order/update', Order.update);
router.post('/order/revoke', Order.revoke);

module.exports = router;