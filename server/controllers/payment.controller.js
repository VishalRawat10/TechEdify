const { razorpayInstance } = require("../config/razorpay.config");
const User = require("../models/user");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
const Payment = require("../models/payment");
const ExpressError = require("../utils/ExpressError");
const crypto = require("crypto");

module.exports.initiatePayment = async (req, res, next) => {
    const { courseId } = req.body;
    const course = await Course.findById(courseId).select("+enrolledStudents");

    if (!course) {
        return next(new ExpressError(400, "Course Not Found!"));
    }

    if (course.enrolledStudents.includes(req.user._id)) {
        return next(new ExpressError(400, "User is already enrolled to the course!"));
    }
    const options = {
        amount: course.price * 100,
        currency: "INR",
        receipt: "receipt#1",
    }
    razorpayInstance.orders.create(options, async (err, order) => {
        if (err) {
            return next(err);
        }
        console.log(order);
        const payment = new Payment({
            orderId: order.id,
            courseId: course._id,
            userId: req.user._id,
            amount: order.amount / 100
        });
        await payment.save();
        return res.status(201).json({ course, order, message: "Payment initiated successfully!", success: true })
    });
}

module.exports.verifyPayment = async (req, res, next) => {
    const { razorpay_signature, razorpay_order_id, razorpay_payment_id } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY).update(body.toString()).digest("hex");

    if (expectedSignature === razorpay_signature) {
        //update payment to success
        const payment = await Payment.findOneAndUpdate({ orderId: razorpay_order_id }, { status: "success", transactionId: razorpay_payment_id }, { new: true });

        //create the enrollment
        const enrollment = new Enrollment({
            course: payment.courseId,
            user: payment.userId,
            paymentId: payment._id,
        });
        await enrollment.save();

        //Add user to enrolledStudents of course
        await Course.findByIdAndUpdate(payment.courseId, { $push: { enrolledStudents: payment.userId } });

        //Add course to user's enrolledCourses
        await User.findByIdAndUpdate(payment.userId, { $push: { enrolledCourses: payment.courseId } });
        return res.redirect(`${process.env.CLIENT_URL}/courses/${payment.courseId}/learn`);
    }

    return next(new ExpressError(403, "Unauthorized payment!"));
}