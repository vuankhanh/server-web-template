const express = require("express");
const router = express.Router();
const localPathConfig = require('../config/local-path');

const adminRoutes = require("../routes/admin");
const clientRoutes = require('../routes/client');

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initRoutes = (app) => {
    app.use('/gallery', express.static(localPathConfig.gallery));
    app.use('/icon', express.static(localPathConfig.icon));
    app.use('/admin', adminRoutes);
    app.use('/client', clientRoutes);

    return app.use("/", router);
}

module.exports = initRoutes;