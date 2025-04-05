const User = require("../models/user.js");
const BlacklistToken = require("../models/blacklistToken.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { cloudinary } = require("../services/cloudinaryConfig.js");
const { generateJwt } = require("../utils/jwtUtils.js");


//SignUp controller
module.exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: errors.array().map((err) => err.msg).join(" ") });
    }
    const { firstname, lastname, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) return res.status(401).json({ message: "The email is already associated with an account! Please sign in or use other email." });
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullname: {
                firstname,
                lastname
            },
            email,
            password: hashPassword
        });
        await newUser.save();
        const token = generateJwt(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
        });
        return res.status(200).json({
            message: "Welcome to codingShala!", success: true, user: { ...newUser, password: "" }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//Login controller
module.exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: errors.array().map((err) => err.msg).join(" ") });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = generateJwt(user._id);
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
                });
                return res.status(200).json({
                    message: "User logged in successfully.", success: true,
                    user: { ...user, password: "" }
                });
            }
        }

        res.status(401).json({ message: "Invalid email or password!" });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

//Logout Controller
module.exports.logout = async (req, res, next) => {
    try {
        await BlacklistToken.create({
            token: req.token
        });
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged Out successfully!" });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}

// UserProfile controller
module.exports.getUserProfile = async (req, res, next) => {
    const token = await BlacklistToken.findOne({ token: req.token });
    if (token) {
        return res.status(401).json({ message: "Unauthorized! Token is expired!" });
    }
    return res.status(200).json({ user: req.user });
}

//Profile Image Upload
module.exports.uploadProfileImg = async (req, res, next) => {
    const token = await BlacklistToken.findOne({ token: req.token });
    if (token) return res.status(401).json({ message: "Unauthorized!", success: false });
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { $set: { profileImg: { url: req.file.path, filename: req.file.filename } } });
        res.status(200).json({ user, message: "Profile image updated successfully.", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}

//Destroy Profile Image
module.exports.destroyProfileImg = async (req, res, next) => {
    const token = await BlacklistToken.findOne({ token: req.token });
    if (token) return res.status(401).json({ message: "Unauthorized!" });
    try {
        const result = await cloudinary.uploader.destroy(req.user.profileImg.filename);
        if (result.result === "not found") return res.status(400).json({ message: "Image not found!", success: false });
        const user = await User.findByIdAndUpdate(req.user._id, { $set: { profileImg: { url: "", filename: "" } } });
        res.status(200).json({ user, message: "Profile image deleted successfully", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!", error: err.message, success: false });
    }
}

//Update User Details
module.exports.updateUser = async (req, res, next) => {
    const token = await BlacklistToken.findOne({ token: req.token });
    if (token) return res.status(401).json({ message: "Unauthorized!" });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: errors.array().map((err) => err.msg).join(" ") });
    }
    try {
        const { firstname, lastname, email, about, DOB, phone, address } = req.body;
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                fullname: {
                    firstname,
                    lastname,
                },
                email, about, DOB, phone, address
            }
        })
        const newToken = generateJwt(req.user._id);
        const newBlackToken = new BlacklistToken({
            token: req.token
        });
        await newBlackToken.save();
        res.status(200).json({ token: newToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Couldn't update.", error: err.message });
    }
}