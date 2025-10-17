const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { isAuthenticated } = require("../middlewares/middlewares");
const wrapAsync = require("../utils/wrapAsync");

router.route("/").get(isAuthenticated, wrapAsync(messageController.getMessages)).post(wrapAsync(messageController.send));

router.route("/unread").get(isAuthenticated, wrapAsync(messageController.getUnreadMessages));

module.exports = router;