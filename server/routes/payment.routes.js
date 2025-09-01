const express = require("express");
const { isAuthenticated } = require("../middlewares/middlewares");
const paymentController = require("../controllers/payment.controller");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();

router.post("/", isAuthenticated, wrapAsync(paymentController.initiatePayment));
router.post("/verify", isAuthenticated, wrapAsync(paymentController.verifyPayment));
module.exports = router;