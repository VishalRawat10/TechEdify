const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const device = require('express-device');

const coursesRouter = require("./routes/courses.routes.js");
const messageRouter = require("./routes/message.routes.js");
const userRouter = require("./routes/user.routes.js");
const tutorRouter = require("./routes/tutor.routes.js");
const reviewRouter = require("./routes/review.routes.js");
const paymentRouter = require("./routes/payment.routes.js");
const adminRouter = require("./routes/admin.routes.js");


//Useful middlewares =============================================
app.use(cookieParser("dfjjju9efjv jsljsljsjflksjfl"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(device.capture());

// Routes =========================================================
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tutors", tutorRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/courses/:courseId/reviews", reviewRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/admin", adminRouter)

//Error Handling middleware =======================================
app.use((err, req, res, next) => {
    console.log("Error is : ", err);
    return res.status(err.status || 500).json({ message: err.message || "Internal server error!" });
});

module.exports = app;