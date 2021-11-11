const express = require('express');
const router = express.Router();

const redirect = require('../../controllers/redirect');
router.get("/:urlCode", redirect);

module.exports = router;