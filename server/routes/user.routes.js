const express = require("express");
const userController = require("../controllers/user.controller.js");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/middlewares.js");
const multer = require('multer');
const { UserStorage } = require("../config/cloudinary.config.js");
const wrapAsync = require("../utils/wrapAsync.js");
const upload = multer({ storage: UserStorage });


router.route("/signup").post(wrapAsync(userController.signup));
router.route("/login").post(wrapAsync(userController.login));
router.route("/logout").post(isAuthenticated, wrapAsync(userController.logout));
router.route("/profile").get(isAuthenticated, wrapAsync(userController.getUserProfile)).put(isAuthenticated, upload.single("profileImage"), wrapAsync(userController.updateUserProfile));
router.route("/profile/change-password").patch(isAuthenticated, wrapAsync(userController.changePassword));
router.route("/payments").get(isAuthenticated, wrapAsync(userController.getPayments));
router.route("/enrolled-courses").get(isAuthenticated, wrapAsync(userController.getEnrolledCourses));
router.route("/undiscussed-tutors").get(isAuthenticated, wrapAsync(userController.getUndiscussedTutors));

router.route("/discussions").get(isAuthenticated, wrapAsync(userController.getDiscussions));
router.route("/discussions/:id/messages").get(isAuthenticated, wrapAsync(userController.getDiscussionMessages));
router.route("/unread-messages").get(isAuthenticated, wrapAsync(userController.getUnreadMessages));

module.exports = router;