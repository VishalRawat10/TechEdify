const express = require("express");
const adminController = require("../controllers/admin.controller.js");
const router = express.Router();
const { authenticateAdmin } = require("../middlewares/middlewares");
const wrapAsync = require("../utils/wrapAsync.js");

//auth routes
router.route("/verify").get(authenticateAdmin, wrapAsync(adminController.verify));
router.route("/login").post(wrapAsync(adminController.login));
router.route("/logout").post(authenticateAdmin, wrapAsync(adminController.logout));

module.exports = router;