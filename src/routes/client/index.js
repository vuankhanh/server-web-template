const express = require('express');
const router = express.Router();

const Auth = require('../../controllers/Authentication');
const Register = require('../../controllers/client/Register');
const CheckExistsUserName = require('../../controllers/client/CheckExistsAccount');

router.get("/");
router.post("/login", Auth.login);
router.post("/check-user-name", CheckExistsUserName.checkExistsUserName);
router.post("/check-email", CheckExistsUserName.checkExistsEmail);
router.post('/register', Register);
module.exports = router;