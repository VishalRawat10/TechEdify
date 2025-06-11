const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const device = require('express-device');

const coursesRouter = require("./routes/courses.js");
const messageRouter = require("./routes/message.js");
const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");
const lectureRouter = require("./routes/lecture.js");
const adminRouter = require("./routes/admin.js");


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
app.use("/api/courses", coursesRouter);
app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/courses/", reviewRouter);
app.use("/api/courses/", lectureRouter);
app.use("/api/admin", adminRouter)

//Error Handling middleware =======================================
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;