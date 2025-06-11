const User = require("../models/user");
const Instructor = require("../models/instructor");
const { verifyJwt } = require("../utils/jwtUtils");
const BlacklistToken = require("../models/blacklistToken");

module.exports.authMiddleware = async (req, res, next) => {
    const token = req.signedCookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unathorized!" });
    }
    const blackListedToken = await BlacklistToken.findOne({ token });
    if (blackListedToken) {
        return res.status(401).clearCookie("token", { signed: true }).json({ message: "Please login to continue" });
    }
    try {
        const decoded = verifyJwt(token);
        const user = await User.findById(decoded._id);
        req.user = user;
        req.token = token;
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: err.message });
    }
}

module.exports.isInstructor = async (req, res, next) => {
    const instructor = await Instructor.findById(req.user.instructorId);
    if (req.user.role === "instructor" && instructor) {
        req.instructor = instructor;
        return next();
    }
    return res.status(401).json({ message: "Please login as instructor to create course!" });
}