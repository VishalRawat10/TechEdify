const User = require("../models/user.js");
const BlacklistToken = require("../models/blacklistToken.js");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../config/cloudinary.config.js");
const { generateJwt } = require("../utils/jwtUtils.js");
const ExpressError = require("../utils/ExpressError.js");

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
        sameSite: 'Strict',
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
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
                signed: true
            });

            user.password = null;
            return res.status(200).json({
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

// UserProfile controller
module.exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    return res.status(200).json({ user, message: "User fetched successfully!" });
}

//Profile Image Upload
module.exports.uploadProfileImage = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { profileImage: { url: req.file.path, filename: req.file.filename } } }, { new: true });

    res.status(200).json({ user, message: "Profile image updated successfully." });
}

//Destroy Profile Image
module.exports.destroyProfileImage = async (req, res, next) => {
    const result = await cloudinary.uploader.destroy(req.user.profileImage.filename || `TechEdify/Users/${req.user._id}/profile-image`);
    if (result.result === "not found") return next(new ExpressError(400, "Image not found!"));
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { profileImage: { url: "", filename: "" } } }, { new: true });
    return res.status(200).json({ user, message: "Profile image deleted successfully" });
}

//Update User Details
module.exports.updateUser = async (req, res, next) => {
    const { fullname, email, about, DOB, phone, address } = req.body;
    if (!fullname || !email) {
        return next(new ExpressError(400, "Fullname or email missing!"));
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            fullname, email, about, DOB, phone, address
        }
    }, { new: true, runValidators: true });

    return res.status(200).json({ user, message: "Profile updated successfully." });
}

//Change password
module.exports.updatePassword = async (req, res, next) => {
    const { newPassword, currentPassword } = req.body;
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
        return next(new ExpressError(400, "Invalid password format!"));
    }

    const user = await User.findById(req.user._id).select("password");

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
        return next(new ExpressError(403, "Current password is incorrect!"));
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashPassword });
    return res.status(200).json({ message: "Password updated successfully!" });
}


//Suspend user
module.exports.suspend = async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isSuspended: true }, { new: true, runValidators: true });
    if (!user) {
        return next(new ExpressError(400, "User does not exist!"));
    }
    return res.status(200).json({ user, message: "User suspended successfully!" });
}

//Unsuspend user
module.exports.unsuspend = async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isSuspended: false }, { new: true, runValidators: true });
    if (!user) {
        return next(new ExpressError(400, "User does not exist!"));
    }
    return res.status(200).json({ user, message: "User unsuspended successfully!" });
}

//Get all students
module.exports.getAllStudents = async (req, res, next) => {
    const students = await User.find();
    return res.status(200).json({ students, message: "Students fetched successfully!" });
}