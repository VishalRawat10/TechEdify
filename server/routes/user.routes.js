const express = require("express");
const userController = require("../controllers/user.controller.js");
const router = express.Router();
const { isAuthenticated, authenticateAdmin } = require("../middlewares/middlewares.js");
const multer = require('multer');
const { cloudinary, storage } = require("../config/cloudinary.config.js");
const wrapAsync = require("../utils/wrapAsync.js");
const upload = multer({ storage });

//For admin
router.route("/").get(authenticateAdmin, wrapAsync(userController.getUsers));
router.route("/:userId").get(authenticateAdmin, wrapAsync(userController.getUser)).delete(authenticateAdmin, wrapAsync(userController.destroyUser));
router.route("/:userId/suspend").put(authenticateAdmin, wrapAsync(userController.suspend));
router.route("/:userId/unsuspend").put(authenticateAdmin, wrapAsync(userController.unsuspend));

//For user
router.route("/signup").post(wrapAsync(userController.signup));
router.route("/login").post(wrapAsync(userController.login));
router.route("/logout").post(isAuthenticated, wrapAsync(userController.logout));
router.route("/profile").get(isAuthenticated, wrapAsync(userController.getUserProfile)).put(isAuthenticated, wrapAsync(userController.updateUser));
router.route("/profile/profileImage").put(isAuthenticated, upload.single("profileImage"), wrapAsync(userController.uploadProfileImage)).delete(isAuthenticated, wrapAsync(userController.destroyProfileImage));
router.route("/update-password").put(isAuthenticated, wrapAsync(userController.updatePassword));

module.exports = router;