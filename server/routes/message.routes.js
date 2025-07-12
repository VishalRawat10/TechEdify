const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { isAuthenticated } = require("../middlewares/middlewares");

router.route("/").get(isAuthenticated, messageController.getMessages);

router.route("/").post(messageController.send);

module.exports = router;