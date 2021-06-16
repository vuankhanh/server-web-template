const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");

const Auth = require('../../controllers/Authentication');
const Config = require("../../controllers/Config");
const Register = require('../../controllers/client/Register');
const CheckExistsUserName = require('../../controllers/client/CheckExistsAccount');
const UpdateInformation = require('../../controllers/client/UpdateInformation');
const AdministrativeUnits = require('../../controllers/client/AdministrativeUnits');
const CustomerAddress = require('../../controllers/client/CustomerAddress');

router.get("/");
router.post("/login", Auth.login);
router.post("/refresh-token", Auth.refreshToken);
router.post("/check-user-name", CheckExistsUserName.checkExistsUserName);
router.post("/check-email", CheckExistsUserName.checkExistsEmail);
router.post('/register', Register);

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

// List Protect APIs:
router.get("/config", Config.friendLists);
router.get("/administrative-units", AdministrativeUnits.province);
router.get("/administrative-units/:provinceCode/district", AdministrativeUnits.district);
router.get("/administrative-units/:districtCode/ward", AdministrativeUnits.ward);
router.post("/customer/address/insert", CustomerAddress.insert);
router.put("/customer/address/update", CustomerAddress.update);
router.put("/customer/address/update", CustomerAddress.update);
router.put("/customer/address/remove", CustomerAddress.remove);
router.put("/update-customer", UpdateInformation);

module.exports = router;