const express = require('express');
const router = express.Router();
const AuthMiddleWare = require("../../middleware/AuthMiddleware");
const RoleMiddleWare = require('../../middleware/Role');

const Auth = require('../../controllers/Authentication');
const Config = require('../../controllers/Config');
const Account = require('../../controllers/admin/Account');
const AdminManagement = require('../../controllers/admin/AdminManagement');
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
const ProductReviews = require('../../controllers/admin/ProductReviews');

const SSMManagement = require('../../controllers/admin/SSMManagement');

router.post("/login", Auth.login);
router.post("/refresh-token", Auth.refreshToken);

// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.use(AuthMiddleWare.isAuth);

// List Protect APIs:
router.get("/config", Config.adminConfig);

router.put('/account/change-password', Account.changePassword);
// router.get('/account');

router.get('/admin-management', RoleMiddleWare.grantAccess(1), AdminManagement.getAll);
router.get('/admin-management/:id', RoleMiddleWare.grantAccess(1), AdminManagement.getDetail);
router.post('/admin-management/insert', RoleMiddleWare.grantAccess(1), AdminManagement.insert);
router.put('/admin-management/update', RoleMiddleWare.grantAccess(1), AdminManagement.update);

router.get('/user-management', RoleMiddleWare.grantAccess(1), UserManagement.getAll);
router.get('/user-management/:id', RoleMiddleWare.grantAccess(1), UserManagement.getDetail);

router.get('/product-category', RoleMiddleWare.grantAccess(1), ProductCategory.getAll);
router.post('/product-category/insert', RoleMiddleWare.grantAccess(1), ProductCategory.insert);
router.put('/product-category/update', RoleMiddleWare.grantAccess(1), ProductCategory.update);
router.post('/product-category/remove', RoleMiddleWare.grantAccess(1), ProductCategory.remove);

router.get('/product-gallery', RoleMiddleWare.grantAccess(1), ProductGallery.getAll);
router.get('/product-gallery/:id', RoleMiddleWare.grantAccess(1), ProductGallery.getDetail);
router.post('/product-gallery/insert', RoleMiddleWare.grantAccess(1), ProductGallery.insert);
router.put('/product-gallery/update', RoleMiddleWare.grantAccess(1), ProductGallery.update);
router.post('/product-gallery/remove', RoleMiddleWare.grantAccess(1), ProductGallery.remove);

router.get('/product-gallery-video', RoleMiddleWare.grantAccess(1), ProductGalleryVideo.getAll);
router.post('/product-gallery-video/insert', RoleMiddleWare.grantAccess(1), ProductGalleryVideo.insert);
router.put('/product-gallery-video/update', RoleMiddleWare.grantAccess(1), ProductGalleryVideo.update);
router.post('/product-gallery-video/remove', RoleMiddleWare.grantAccess(1), ProductGalleryVideo.remove);

router.get('/banner-gallery', RoleMiddleWare.grantAccess(1), BannerGallery.getAll);
router.post('/banner-gallery/insert', RoleMiddleWare.grantAccess(1), BannerGallery.insert);
router.put('/banner-gallery/update', RoleMiddleWare.grantAccess(1), BannerGallery.update);
router.post('/banner-gallery/remove', RoleMiddleWare.grantAccess(1), BannerGallery.remove);

router.get('/product', RoleMiddleWare.grantAccess(1), Product.getAll);
router.get('/product/search', RoleMiddleWare.grantAccess(1), Product.searching);
router.post('/product/insert', RoleMiddleWare.grantAccess(1), Product.insert);
router.put('/product/update', RoleMiddleWare.grantAccess(1), Product.update);
router.post('/product/remove', RoleMiddleWare.grantAccess(1), Product.remove);

router.get('/posts', RoleMiddleWare.grantAccess(1), Post.getAll);
router.post('/posts/insert', RoleMiddleWare.grantAccess(1), Post.insert);
router.put('/posts/update', RoleMiddleWare.grantAccess(1), Post.update);
router.post('/posts/remove', RoleMiddleWare.grantAccess(1), Post.remove);

router.get('/identification', RoleMiddleWare.grantAccess(1), Identification.getAll);
router.post('/identification/logo/insert', RoleMiddleWare.grantAccess(1), Identification.insertLogo);
router.put('/identification/logo/update', RoleMiddleWare.grantAccess(1), Identification.updateLogo);
router.put('/identification/phone-number/update', RoleMiddleWare.grantAccess(1), Identification.updatePhoneNumber);
router.put('/identification/social-networking/update', RoleMiddleWare.grantAccess(1), Identification.updateSocialNetwork);
router.put('/identification/address/update', RoleMiddleWare.grantAccess(1), Identification.updateAddress);

router.post('/redirect/insert', RoleMiddleWare.grantAccess(1), Redirect.insert);

router.get("/administrative-units", AdministrativeUnits.province);
router.get("/administrative-units/:provinceCode/district", AdministrativeUnits.district);
router.get("/administrative-units/:districtCode/ward", AdministrativeUnits.ward);

router.get('/order', RoleMiddleWare.grantAccess(1), Order.getAll);
router.get('/order/:orderId', RoleMiddleWare.grantAccess(1), Order.getDetail);
router.put('/order/:orderId/revoke', RoleMiddleWare.grantAccess(1), Order.revokeOrder);
router.put('/order/:orderId/confirm', RoleMiddleWare.grantAccess(1), Order.confirmOrder);
router.put('/order/:orderId/isComing', RoleMiddleWare.grantAccess(1), Order.isComing);
router.put('/order/:orderId/done', RoleMiddleWare.grantAccess(1), Order.finish);
router.post('/order/insert', RoleMiddleWare.grantAccess(1), Order.createOrder);

router.get('/product-reviews', RoleMiddleWare.grantAccess(2), ProductReviews.getProductReviews);
router.get('/product-reviews/:commentId', RoleMiddleWare.grantAccess(2), ProductReviews.getProductReviewsDetail);
router.put('/product-reviews/:commentId/changeStatus', RoleMiddleWare.grantAccess(2), ProductReviews.changeProductReviewsStatus);

router.post('/ssm/fake-send-sms', RoleMiddleWare.grantAccess(4), SSMManagement.sendSMS);

module.exports = router;