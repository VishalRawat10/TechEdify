require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const coursesRouter = require("./routes/courses.js");
const messageRouter = require("./routes/message.js");
const userRouter = require("./routes/user.js");


const port = process.env.PORT || 3000;

//Useful middlewares =============================================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Routes =========================================================
app.use("/courses", coursesRouter);
app.use("/auth", userRouter);
app.use("/message", messageRouter);


//Error Handling middleware =======================================
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({ message: err.message });
});


//Listening to the port============================================
app.listen(port, () => {
    console.log(`app is listening to port ${port}...`);
});


//Connecting to mongoose ==========================================
const main = async () => {
    return await mongoose.connect(process.env.MONGODB_URL);
}

main().then((res) => {
    console.log("Mongoose is connected successfully...");
})
    .catch((err) => {
        console.log(err);
    });