const express = require("express");
const { wrapAsync } = require("../utils/wrapAsync");
const userController = require("../controllers/user");
const router = express.Router();
const { body } = require("express-validator");
const { authMiddleware } = require("../middlewares/authMiddlewares");

router.route("/signup").post([
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("firstname").isLength({ min: 2 }).withMessage("Firstname must contain 2 or more character."),
    body("password").isLength({ min: 6 }).withMessage("Password must contain minimum of 6 character.")
], wrapAsync(userController.signup));

router.route("/login").post(wrapAsync(userController.login));
router.route("/logout").post(authMiddleware, wrapAsync(userController.logout));

router.route("/profile").get(authMiddleware, wrapAsync(userController.getUserProfile));

module.exports = router;