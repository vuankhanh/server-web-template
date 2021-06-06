const express = require('express');
const router = express.Router();

const Auth = require('../../controllers/Authentication');
const Register = require('../../controllers/client/Register');

router.get("/");
router.post("/login", Auth.login);
router.post('/register', Register);
module.exports = router;