const User = require("../models/user");
const Tutor = require("../models/tutor");
const Admin = require("../models/admin");
const Discussion = require("../models/discussion");
const jwt = require("jsonwebtoken");
const { verifyJwt } = require("../utils/jwtUtils");
const BlacklistToken = require("../models/blacklistToken");
const ExpressError = require("../utils/ExpressError");
const Course = require("../models/course");

module.exports.isAuthenticated = async (req, res, next) => {
    const token = req.signedCookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(new ExpressError(401, "Unathorized! Auth token missing!"));
    }
    const blackListedToken = await BlacklistToken.findOne({ token });
    if (blackListedToken) {
        res.clearCookie("token", { signed: true });
        return next(new ExpressError(401, "Please login to continue!"));
    }
    try {
        const decoded = verifyJwt(token);
        const user = await User.findById(decoded._id);
        if (!user) {
            return next(new ExpressError(401, "Unathorized! Login to continue."));
        }
        req.user = user;
        req.token = token;
        return next();
    }
    catch (err) {
        return next(new ExpressError(500, err.message));
    }
}

module.exports.authenticateTutor = async (req, res, next) => {
    const tutorToken = req.signedCookies.tutorToken || req.headers.authorization?.split(" ")[1];
    if (!tutorToken) {
        return next(new ExpressError(401, "Unauthorized! Auth token missing!"));
    }
    try {
        const blackListedToken = await BlacklistToken.findOne({ token: tutorToken });
        if (blackListedToken) {
            res.clearCookie("tutorToken", { signed: true });
            return next(new ExpressError(401, "Please login to continue!"));
        }
        const decoded = jwt.verify(tutorToken, process.env.TUTOR_JWT_SECRET_KEY);
        const tutor = await Tutor.findById(decoded._id);
        if (!tutor) {
            return next(new ExpressError(401, "Plase login as tutor to continue!"));
        }
        req.tutor = tutor;
        req.token = tutorToken;
        return next();
    } catch (err) {
        return next(new ExpressError(500, err.message));
    }
}

module.exports.authenticateAdmin = async (req, res, next) => {
    const adminToken = req.signedCookies.adminToken || req.headers.authorization?.split(" ")[1];
    if (!adminToken) {
        return next(new ExpressError(401, "Please login as admin to continue."));
    }
    try {
        const blackListedToken = await BlacklistToken.findOne({ token: adminToken });
        if (blackListedToken) {
            res.clearCookie("adminToken", { signed: true });
            return next(new ExpressError(401, "Please login as admin to continue!"));
        }
        const decoded = jwt.verify(adminToken, process.env.ADMIN_JWT_SECRET_KEY);
        const admin = await Admin.findById(decoded._id);
        if (!admin) {
            return next(new ExpressError(401, "Admin not found!"));
        }
        req.admin = admin;
        req.adminToken = adminToken;
        next();
    } catch (err) {
        return next(new ExpressError(500, err.message));
    }
}

module.exports.isEnrolled = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id).select("+enrolledStudents");
    if (!course) {
        return next(new ExpressError(400, "Course not found!"));
    }
    if (course.enrolledStudents.includes(req.user._id)) {
        req.course = course;
        return next();
    }
    return next(new ExpressError(401, "You are not enrolled to the course!"));
}

module.exports.isCourseTutor = async (req, res, next) => {
    let { id } = req.params;
    if (!id) {
        id = req.body.courseId;
        console.log(id);
    }
    const course = await Course.find({ _id: id, tutor: req.tutor._id }).select("+lectures");
    if (!course) {
        return next(new ExpressError(403, "You are not the tutor of course!"));
    }

    return next();
}

module.exports.destroyFromCloudinary = (filename) => {
    if (filename) {
        return async (req, res, next) => {
            const result = await cloudinary.uploader.destroy(filename);
            if (result.result === "not found") return next(new ExpressError(400, "Profile image not found!"));
        }
    }
    return next();
}

module.exports.isDiscussionMember = async (req, res, next) => {
    const discussion = await Discussion.findOne({ "members.member": req.tutor?._id || req.user?._id });


    if (discussion) {
        return next();
    }
    return next(new ExpressError(403, "You are not member of discussion!"));
}
