const Razorpay = require("razorpay");

module.exports.razorpayInstance = new Razorpay({
    key_secret: process.env.RAZORPAY_SECRET_KEY,
    key_id: process.env.RAZORPAY_KEY_ID,
});

