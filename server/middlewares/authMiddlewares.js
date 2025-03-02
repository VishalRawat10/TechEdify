const User = require("../models/user");
const { verifyJwt } = require("../utils/jwtUtils");

module.exports.authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
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