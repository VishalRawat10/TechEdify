const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

module.exports.adminAuthMiddleware = async (req, res, next) => {
    const adminToken = req.signedCookies.adminToken || req.headers.authorization?.split(" ")[1];
    if (!adminToken) {
        return res.status(401).json({ message: "Please login as admin to continue.", error: "Unathorized! Admin token not found!" })
    }
    try {
        const decoded = jwt.verify(adminToken, process.env.ADMIN_JWT_SECRET_KEY);
        const admin = await Admin.findById(decoded._id);
        if (!admin) {
            return res.status(400).json({ message: "Error in finding the admin." })
        }
        req.admin = admin;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}
