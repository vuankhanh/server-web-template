const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");
const localPathConfig = require('../../config/local-path');

const Auth = require('../../controllers/Authentication');
const Config = require('../../controllers/Config');
const ProductCategory = require('../../controllers/admin/ProductCategory');
const BannerGallery = require('../../controllers/admin/BannerGallery');
const ProductGallery = require('../../controllers/admin/ProductGallery');
const Product = require('../../controllers/admin/Product');
const Post = require('../../controllers/admin/Post');
const Identification = require('../../controllers/admin/Identification');

router.post("/login", Auth.login);
router.post("/refresh-token", Auth.refreshToken);

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

// List Protect APIs:
router.get("/config", Config);
router.get('/product-category', ProductCategory.getAll);
router.post('/product-category/insert', ProductCategory.insert);
router.put('/product-category/update', ProductCategory.update);
router.post('/product-category/remove', ProductCategory.remove);

router.get('/product-gallery', ProductGallery.getAll);
router.post('/product-gallery/insert', ProductGallery.insert);
router.put('/product-gallery/update', ProductGallery.update);
router.post('/product-gallery/remove', ProductGallery.remove);

router.get('/banner-gallery', BannerGallery.getAll);
router.post('/banner-gallery/insert', BannerGallery.insert);
router.put('/banner-gallery/update', BannerGallery.update);
router.post('/banner-gallery/remove', BannerGallery.remove);

router.get('/product', Product.getAll);
router.post('/product/insert', Product.insert);
router.put('/product/update', Product.update);
router.post('/product/remove', Product.remove);

router.get('/posts', Post.getAll);
router.post('/posts/insert', Post.insert);
router.put('/posts/update', Post.update);
router.post('/posts/remove', Post.remove);

router.get('/identification', Identification.getAll);
router.post('/identification/logo/insert', Identification.insertLogo);
router.put('/identification/logo/update', Identification.updateLogo);
router.put('/identification/phone-number/update', Identification.updatePhoneNumber);
router.put('/identification/social-networking/update', Identification.updateSocialNetwork);
router.put('/identification/address/update', Identification.updateAddress);

module.exports = router;