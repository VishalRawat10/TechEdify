const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
const blacklistToken = require("../models/blacklistToken");

module.exports.verify = async (req, res, next) => {
    if (req.admin.isTempPassword) {
        return res.status(200).json({ admin: req.admin, message: "Create new password to continue." });
    }
    return res.status(200).json({ admin: req.admin });
}

module.exports.login = async (req, res, next) => {
    const { adminEmail, adminPassword } = req.body;
    if (!adminEmail || !adminPassword) {
        return next(new ExpressError(400, "Invalid email or password!"));
    }
    const admin = await Admin.findOne({ email: adminEmail }).select("+password");

    if (admin.isTempPassword) {
        if (adminPassword === admin.password) {
            const adminToken = jwt.sign({ _id: admin._id }, process.env.ADMIN_JWT_SECRET_KEY, { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN });
            res.cookie("adminToken", adminToken, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
                signed: true,
                maxAge: 10 * 60 * 60 * 1000
            });
            return res.status(200).json({ message: "Create new password to continue.", admin });
        } else {
            return next(new ExpressError(401, "Invalid email or password!"));
        }
    }

    //IS ADMIN DOES NOT EXIST WITH GIVEN EMAIL
    if (!admin) {
        return next(new ExpressError(401, "Incorrect email or password!"));
    }

    const matched = await bcrypt.compare(adminPassword, admin.password);
    if (matched) {
        const adminToken = jwt.sign({ _id: admin._id }, process.env.ADMIN_JWT_SECRET_KEY, { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "10h" });
        res.cookie("adminToken", adminToken, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: true,
            signed: true,
            maxAge: 10 * 60 * 60 * 1000
        });
        if (admin.isTempPassword) {
            return res.status(200).json({ message: "Create new password to continue.", admin });
        }
        return res.status(200).json({ admin: { ...admin, password: null }, message: "Admin logged in successfully!" });
    }
    return next(new ExpressError(401, "Incorrect email or password!"));
}

module.exports.logout = async (req, res, next) => {
    const blacklistedToken = new blacklistToken({
        token: req.token
    });
    await blacklistedToken.save();
    res.status(200).clearCookie("adminToken", { signed: true }).json({ message: "Logged out successfulyy" });
}


