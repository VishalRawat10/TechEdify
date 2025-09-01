const express = require("express");
const userController = require("../controllers/user.controller.js");
const router = express.Router();
const { isAuthenticated, authenticateAdmin } = require("../middlewares/middlewares.js");
const multer = require('multer');
const { UserStorage } = require("../config/cloudinary.config.js");
const wrapAsync = require("../utils/wrapAsync.js");
const upload = multer({ storage: UserStorage });

//For admin
router.route("/").get(authenticateAdmin, wrapAsync(userController.getUsers));

//For user
router.route("/signup").post(wrapAsync(userController.signup));
router.route("/login").post(wrapAsync(userController.login));
router.route("/logout").post(isAuthenticated, wrapAsync(userController.logout));
router.route("/profile").get(isAuthenticated, wrapAsync(userController.getUserProfile)).put(isAuthenticated, wrapAsync(userController.updateUser));
router.route("/profile/profile-image").put(isAuthenticated, upload.single("profileImage"), wrapAsync(userController.uploadProfileImage)).delete(isAuthenticated, wrapAsync(userController.destroyProfileImage));
router.route("/update-password").put(isAuthenticated, wrapAsync(userController.updatePassword));

router.route("/:userId").get(authenticateAdmin, wrapAsync(userController.getUser)).delete(authenticateAdmin, wrapAsync(userController.destroyUser));
router.route("/:userId/suspend").put(authenticateAdmin, wrapAsync(userController.suspend));
router.route("/:userId/unsuspend").put(authenticateAdmin, wrapAsync(userController.unsuspend));



module.exports = router;