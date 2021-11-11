const express = require("express");
const router = express.Router();
const localPathConfig = require('../config/local-path');

const adminRoutes = require("../routes/admin");
const clientRoutes = require('../routes/client');
const redirect = require('../routes/redirect');

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initRoutes = (app, io) => {
    app.use('/gallery', express.static(localPathConfig.gallery));
    app.use('/icon', express.static(localPathConfig.icon));

    app.use(function(req,res,next){
        req.io = io;
        next();
    });

    app.use('/admin', adminRoutes);
    app.use('/client', clientRoutes);
    app.use('/redirect', redirect);

    return app.use("/", router);
}

module.exports = initRoutes;