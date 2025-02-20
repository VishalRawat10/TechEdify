const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");
const { body } = require("express-validator");

router.route("/").post([
    body("name").isLength({ min: 3 }).withMessage("Name should be minimum 2 character long!"),
    body("email").isEmail().withMessage("Invalid email address!"),
    body("message").isLength({ min: 10 }).withMessage("Message should be 10 more character long!")
], messageController.send);

module.exports = router;