const User = require("../models/user.js");
const Course = require("../models/course.js");
const Tutor = require("../models/tutor.js");
const Discussion = require("../models/discussion.js");
const Payment = require("../models/payment.js");
const Message = require("../models/message.js");
const BlacklistToken = require("../models/blacklistToken.js");
const bcrypt = require("bcrypt");
const { generateJwt } = require("../utils/jwtUtils.js");
const ExpressError = require("../utils/ExpressError.js");
const { userSchema } = require("../config/joiSchema.config.js");

//SignUp controller
module.exports.signup = async (req, res, next) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return next(new ExpressError(400, "Incomplete user information!"));
    }
    const user = await User.findOne({ email });
    if (user) return next(new ExpressError(400, "The email is already associated with an account! Please sign in or use other email."));
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        fullname: fullname,
        email,
        password: hashPassword
    });
    const token = generateJwt(newUser._id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
        signed: true
    });
    newUser.currToken = token;
    newUser.currDevice = req.device.type;
    newUser.currLoginTime = new Date();
    newUser.isLoggedIn = true;
    await newUser.save();
    newUser.password = null;
    return res.status(200).json({
        message: "Welcome to TechEdify!", user: newUser
    });
}

//Login controller
module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ExpressError(400, "Email or password missing!"));
    }

    const user = await User.findOne({ email }).select("+password").populate("enrolledCourses");
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            if (user.currToken && user.isLoggedIn) {
                const blackListedToken = new BlacklistToken({
                    token: user.currToken
                });
                await blackListedToken.save();
            }
            const token = generateJwt(user._id);
            user.currToken = token;
            user.currDevice = req.device.type;
            user.currLoginTime = new Date();
            user.isLoggedIn = true;
            await user.save();

            user.password = null;
            return res.status(200).cookie("token", token, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
                signed: true
            }).json({
                message: "User logged in successfully.",
                user
            });
        }
    }
    return next(new ExpressError(401, "Invalid email or password!"));
}

//Logout Controller
module.exports.logout = async (req, res, next) => {
    await BlacklistToken.create({
        token: req.token
    });
    req.user.isLoggedIn = false;
    await req.user.save();
    res.clearCookie("token", { signed: true });
    return res.status(200).json({ message: "Logged out successfully!" });
}

//UserProfile controller
module.exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("enrolledCourses", "title thumbnail");
    return res.status(200).json({ user, message: "User fetched successfully!" });
}

//Update User Details
module.exports.updateUserProfile = async (req, res, next) => {
    const { fullname, email, about, DOB, contact, address, country } = req.body;

    const userDetails = { fullname, email, about, DOB, contact, address, country };

    const { error } = userSchema.validate(userDetails);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }

    if (req.file) {
        userDetails.profileImage = {
            url: req.file.pathname,
            filename: req.file.filename
        }
    }
    const user = await User.findByIdAndUpdate(req.user._id, userDetails, { new: true, runValidators: true });

    return res.status(200).json({ user, message: "Profile updated successfully." });
}

//Change password
module.exports.changePassword = async (req, res, next) => {
    const { newPassword, oldPassword } = req.body;

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
        return next(new ExpressError(400, "Invalid password format!"));
    }

    const user = await User.findById(req.user._id).select("password");

    const matched = await bcrypt.compare(oldPassword, user.password);

    if (!matched) {
        return next(new ExpressError(403, "Please enter correct old password!"));
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashPassword });
    return res.status(200).json({ message: "Password changed successfully!" });
}

//get all payments
module.exports.getPayments = async (req, res, next) => {
    const payments = await Payment.find({ userId: req.user._id, status: "success" }).populate("courseId", "title");

    return res.status(200).json({ transactions: payments, message: "Payments fetched successfully!" });
}

//get enrolled courses
module.exports.getEnrolledCourses = async (req, res, next) => {
    const courses = await Course.find({ enrolledStudents: req.user._id }).select("title thumbnail");
    return res.status(200).json({ courses, message: "Enrolled courses fetched successfully!" });
}

module.exports.getUndiscussedTutors = async (req, res, next) => {
    const discussions = await Discussion.find({ "members.member": req.user._id, type: "private" }).select("members.member");

    let discussedTutors = [];

    discussions.forEach((discussion) => {
        discussedTutors.push(...discussion.members.map((member) => member.member));
    });

    const undiscussedTutors = await Tutor.find({ _id: { $nin: discussedTutors } }).select("fullname profileImage");

    return res.status(200).json({ undiscussedTutors });
}

//Discussions controllers
module.exports.getDiscussions = async (req, res, next) => {
    const discussions = await Discussion.find({ "members.member": req.user._id }).populate("course", "title thumbnail").populate("members.member", "fullname profileImage").populate({ path: "lastMessage", populate: { path: "sender", select: "fullname profileImage createdAt" }, select: "content sender senderModel" });

    return res.status(200).json({ discussions, message: "Discussions fetched successfully!" });
}

module.exports.getDiscussionMessages = async (req, res, next) => {
    const { id } = req.params;

    const messages = await Message.find({ discussion: id }).populate("sender", "fullname profileImage").populate({
        path: "discussion", populate: {
            path: "course",
            select: "title thumbnail"
        }
    });

    return res.status(200).json({ message: "Messages fetched successfully!", messages });
}

module.exports.getUnreadMessages = async (req, res, next) => {

    const discussions = (await Discussion.find({ "members.member": req.user._id })).map((discussion) => discussion._id);
    const unreadMessages = await Message.find({ discussion: { $in: discussions }, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } }).populate("sender", "fullname profileImage");

    return res.status(200).json({ unreadMessages });
}