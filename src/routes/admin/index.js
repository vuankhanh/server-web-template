const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");

const Auth = require('../../controllers/Authentication');
const Config = require("../../controllers/Config");

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

router.get("/", Config.friendLists);
router.post("/login", Auth.login);
router.post("/refresh-token", Auth.refreshToken);
// List Protect APIs:
router.get("/config", Config.friendLists);

module.exports = router;