const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { body } = require("express-validator");
const { adminAuthMiddleware } = require("../middlewares/adminAuthMiddlewares");

router.route("/").get(adminAuthMiddleware, messageController.getMessages);

router.route("/").post([
    body("fullname").isLength({ min: 3 }).withMessage("Name should be minimum 2 character long!"),
    body("email").isEmail().withMessage("Invalid email address!"),
    body("message").isLength({ min: 10 }).withMessage("Message should be 10 more character long!")
], messageController.send);

module.exports = router;