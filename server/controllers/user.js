const User = require("../models/user.js");
const BlacklistToken = require("../models/blacklistToken.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");


//SignUp controller
module.exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: errors.array() });
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
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });
        return res.status(200).json({
            message: "Welcome to codingShala!", token, user: newUser
        });
    } catch (err) {
        res.status(501).json({ message: err.message });
    }
}


//Login controller
module.exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });
                return res.status(200).json({
                    user,
                    token
                });
            }
        }
        res.status(401).json({ message: "Invalid email or password!" });
    } catch (err) {
        res.status(401).json({ message: "Invalid email or password!" });
    }
}

//Logout Controller
module.exports.logout = async (req, res, next) => {
    try {
        await BlacklistToken.create({
            token: req.token
        });
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