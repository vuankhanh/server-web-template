const express = require("express");
const router = express.Router();
const path = require("path");
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const localPathConfig = require('../config/local-path');

const adminRoutes = require("../routes/admin");
const clientRoutes = require('../routes/client');

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initRoutes = (app) => {
    app.use('/gallery', express.static(localPathConfig.gallery));
    app.use('/icon', express.static(path.join(__dirname,'../assets/icon/svg')));
    app.use('/admin', adminRoutes);
    app.use('/client', clientRoutes);

    return app.use("/", router);
}

module.exports = initRoutes;