const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");

const Auth = require('../../controllers/Authentication');
const Config = require('../../controllers/Config');
const UserManagement = require('../../controllers/admin/UserManagement');
const ProductCategory = require('../../controllers/admin/ProductCategory');
const BannerGallery = require('../../controllers/admin/BannerGallery');
const ProductGallery = require('../../controllers/admin/ProductGallery');
const ProductGalleryVideo = require('../../controllers/admin/ProductGalleryVideo');
const Product = require('../../controllers/admin/Product');
const Post = require('../../controllers/admin/Post');
const Identification = require('../../controllers/admin/Identification');
const Redirect = require('../../controllers/admin/Redirect');
const AdministrativeUnits = require('../../controllers/AdministrativeUnits');
const Order = require('../../controllers/admin/Order');

router.post("/login", Auth.login);
router.post("/refresh-token", Auth.refreshToken);

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

// List Protect APIs:
router.get("/config", Config);

router.get('/user-management', UserManagement.getAll);
router.get('/user-management/userId', UserManagement.getDetail);

router.get('/product-category', ProductCategory.getAll);
router.post('/product-category/insert', ProductCategory.insert);
router.put('/product-category/update', ProductCategory.update);
router.post('/product-category/remove', ProductCategory.remove);

router.get('/product-gallery', ProductGallery.getAll);
router.get('/product-gallery/:id', ProductGallery.getDetail);
router.post('/product-gallery/insert', ProductGallery.insert);
router.put('/product-gallery/update', ProductGallery.update);
router.post('/product-gallery/remove', ProductGallery.remove);

router.get('/product-gallery-video', ProductGalleryVideo.getAll);
router.post('/product-gallery-video/insert', ProductGalleryVideo.insert);
router.put('/product-gallery-video/update', ProductGalleryVideo.update);
router.put('/product-gallery-video/remove', ProductGalleryVideo.remove);

router.get('/banner-gallery', BannerGallery.getAll);
router.post('/banner-gallery/insert', BannerGallery.insert);
router.put('/banner-gallery/update', BannerGallery.update);
router.post('/banner-gallery/remove', BannerGallery.remove);

router.get('/product', Product.getAll);
router.get('/product/search', Product.searching);
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

router.post('/redirect/insert', Redirect.insert);

router.get("/administrative-units", AdministrativeUnits.province);
router.get("/administrative-units/:provinceCode/district", AdministrativeUnits.district);
router.get("/administrative-units/:districtCode/ward", AdministrativeUnits.ward);

router.get('/order', Order.getAll);
router.get('/order/:orderId', Order.getDetail);
router.put('/order/:orderId/revoke', Order.revokeOrder);
router.put('/order/:orderId/confirm', Order.confirmOrder);
router.put('/order/:orderId/isComing', Order.isComing);
router.put('/order/:orderId/done', Order.finish);
router.post('/order/insert', Order.createOrder);

module.exports = router;