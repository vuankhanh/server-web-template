const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");

const Auth = require('../../controllers/Authentication');
const Config = require("../../controllers/Config");
const Register = require('../../controllers/client/Register');
const CheckExistsUserName = require('../../controllers/client/CheckExistsAccount');

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

module.exports = router;