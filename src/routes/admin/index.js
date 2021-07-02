const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");
const localPathConfig = require('../../config/local-path');

const Auth = require('../../controllers/Authentication');
const Config = require('../../controllers/Config');
const ProductCategory = require('../../controllers/admin/ProductCategory');
const ProductGallery = require('../../controllers/admin/ProductGallery');
const Product = require('../../controllers/admin/Product');

router.get("/", Config.friendLists);
router.post("/login", Auth.login);
router.post("/refresh-token", Auth.refreshToken);

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

// List Protect APIs:
router.get("/config", Config.friendLists);
router.get('/product-category', ProductCategory.getAll);
router.post('/product-category/insert', ProductCategory.insert);
router.put('/product-category/update', ProductCategory.update);
router.post('/product-category/remove', ProductCategory.remove);

router.get('/product-gallery', ProductGallery.getAll);
router.post('/product-gallery/insert', ProductGallery.insert);
router.post('/product-gallery/update', ProductGallery.update);
router.post('/product-gallery/remove', ProductGallery.remove);

router.get('/product', Product.getAll);
router.post('/product/insert', Product.insert);
router.put('/product/update', Product.update);
router.post('/product/remove', Product.remove);

module.exports = router;