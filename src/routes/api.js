const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");

const adminRoutes = require("../routes/admin");
const clientRoutes = require('../routes/client');

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initRoutes = (app) => {
    
    // router.get("/example-protect-api", ExampleController.someAction);
    app.use('/admin', adminRoutes);
    app.use('/client', clientRoutes);

    return app.use("/", router);
}

module.exports = initRoutes;