const Admin = require("../models/admin");
const Course = require("../models/course");
const User = require("../models/user");
const Tutor = require("../models/tutor");
const Payment = require("../models/payment");
const Enrollment = require("../models/enrollment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
const blacklistToken = require("../models/blacklistToken");
const { adminSchema, tutorSchema } = require("../config/joiSchema.config");

//Auth Controllers
module.exports.getProfile = async (req, res, next) => {
    if (req.admin.isTempPassword) {
        return res.status(200).json({ admin: req.admin, message: "Create new password to continue." });
    }
    return res.status(200).json({ admin: req.admin });
}

module.exports.updateProfile = async (req, res, next) => {
    const { fullname, email, personalEmail } = req.body;

    const { error } = adminSchema.validate({ fullname, email, personalEmail });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }

    const adminDetails = { fullname, email, personalEmail };
    if (req.file) {
        adminDetails.profileImage = {
            url: req.file.path,
            filename: req.file.filename,
        }
    }

    const admin = await Admin.findByIdAndUpdate(req.admin._id, adminDetails, { new: true });

    return res.status(200).json({ admin, message: "Profile details updated successfully!" });

}

module.exports.changePassword = async (req, res, next) => {
    const { newPassword, oldPassword } = req.body;

    if (!newPassword || !oldPassword) return next(new ExpressError(400, "Both passwords are required!"));

    const admin = await Admin.findById(req.admin._id).select("+password");

    const matched = await bcrypt.compare(oldPassword, admin.password);

    if (!matched) return next(new ExpressError(401, "Incorrect password entered!"));

    const hashPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashPassword;
    admin.isTempPassword = false;
    await admin.save();

    return res.status(200).json({ message: "Password changed successfully!" });
}

module.exports.login = async (req, res, next) => {
    const { adminEmail, adminPassword } = req.body;
    if (!adminEmail || !adminPassword) {
        return next(new ExpressError(400, "Invalid email or password!"));
    }
    const admin = await Admin.findOne({ email: adminEmail }).select("+password");

    //IS ADMIN DOES NOT EXIST WITH GIVEN EMAIL
    if (!admin) {
        return next(new ExpressError(401, "Incorrect email or password!"));
    }

    if (admin.isTempPassword) {
        if (adminPassword === admin.password) {
            const adminToken = jwt.sign({ _id: admin._id }, process.env.ADMIN_JWT_SECRET_KEY, { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN });
            res.cookie("adminToken", adminToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                signed: true,
                maxAge: 10 * 60 * 60 * 1000
            });
            return res.status(200).json({ message: "Create new password to continue.", admin });
        } else {
            return next(new ExpressError(401, "Invalid email or password!"));
        }
    }

    const matched = await bcrypt.compare(adminPassword, admin.password);
    if (matched) {
        const adminToken = jwt.sign({ _id: admin._id }, process.env.ADMIN_JWT_SECRET_KEY, { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "10h" });
        res.cookie("adminToken", adminToken, {
            httpOnly: true,
            sameSite: 'None',
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

//Courses Controllers
module.exports.getAllCourses = async (req, res, next) => {
    const courses = await Course.find().populate("tutor", "fullname profileImage");

    return res.status(200).json({ message: "Courses fetched successfully!", courses });
}

module.exports.updateCoursePublishStatus = async (req, res, next) => {
    const { courseId } = req.params;
    const { isPublished } = req.body;

    const course = await Course.findByIdAndUpdate(courseId, { isPublished }, { new: true }).populate("tutor", "fullname profileImage");

    if (!course) {
        return next(new ExpressError(400, "Course not found!"));
    }

    return res.status(200).json({ course, message: isPublished ? "Course is published!" : "Course is unpublished!" });
}

module.exports.destroyCourse = async (req, res, next) => {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
        return next(new ExpressError(400, "Course not found!"));
    }

    const tutor = await Tutor.findByIdAndUpdate(course.tutor, { $pull: { muCourses: courseId } }, { new: true, runValidators: true });

    return res.status(200).json({ message: "Course deleted successfully!", course, tutor });
}

//Tutors controllers
module.exports.getAllTutors = async (req, res, next) => {
    const tutors = await Tutor.find().select("+isSuspended +contact +personalEmail").populate("myCourses", "title thumbnail");

    return res.status(200).json({ message: "Tutors fetched successfully!", tutors });
}

module.exports.createTutor = async (req, res, next) => {
    const { fullname, email, personalEmail, contact, message, password } = req.body;

    const { error } = tutorSchema.validate({ fullname, email, personalEmail, contact, message });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }

    if (!password) {
        return next(new ExpressError(400, "Password is required!"));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const tutor = new Tutor({
        fullname,
        email,
        personalEmail,
        contact,
        message,
        password: hashPassword,
    });

    await tutor.save();

    return res.status(201).json({ tutor, message: "Tutor created successfully!" });

}

module.exports.updateTutorStatus = async (req, res, next) => {
    const { tutorId } = req.params;
    const { isSuspended } = req.body;

    const tutor = await Tutor.findByIdAndUpdate(tutorId, { isSuspended }, { new: true });

    if (!tutor) {
        return next(new ExpressError(400, "Tutor not found!"));
    }

    return res.status(200).json({ tutor, message: isSuspended ? "Tutor has been suspended successfully!" : "Tutor has been activated successfully!" });
}

module.exports.destroyTutor = async (req, res, next) => {
    const { tutorId } = req.params;

    const tutor = await Tutor.findByIdAndDelete(tutorId);

    if (!tutor) return next(new ExpressError(400, "Tutor not found!"));
    return res.status(200).json({ message: "Tutor deleted successfully!", tutor });
}


//Students/User controllers
module.exports.getAllStudents = async (req, res, next) => {
    const students = await User.find().select("+enrolledCourses").populate("enrolledCourses", "title thumbnail");

    return res.status(200).json({ message: "Students fetched successfully!", students });
}

module.exports.updateStudentStatus = async (req, res, next) => {
    const { studentId } = req.params;
    const { isSuspended } = req.body;

    const student = await User.findByIdAndUpdate(studentId, { isSuspended }, { new: true });

    if (!student) {
        return next(new ExpressError(400, "Student not found!"));
    }

    return res.status(200).json({ message: `Student is ${isSuspended ? "suspended" : "activated"} successfully!` });
}

module.exports.destroyStudent = async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) return next(new ExpressError(400, "User not found!"));

    return res.status(200).json({ message: "User deleted successfully!", user });
}


//Stats controller;j
module.exports.getOverviewStats = async (req, res, next) => {

    const [totalCourses, totalTutors, totalStudents, revenueAgg] = await Promise.all([
        Course.countDocuments(),
        Tutor.countDocuments(),
        User.countDocuments(),
        Payment.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    return res.status(200).json({
        totalCourses,
        totalTutors,
        totalStudents,
        totalRevenue
    });
};


module.exports.getEnrollmentStats = async (req, res, next) => {

    const now = new Date();
    const currMonth = now.getMonth(); // 0–11
    const currYear = now.getFullYear();

    // Handle previous month/year (for January)
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const prevMonthYear = currMonth === 0 ? currYear - 1 : currYear;

    // Helper to get start & end of month
    const getMonthRange = (month, year) => {
        const start = new Date(year, month, 1, 0, 0, 0);
        const end = new Date(year, month + 1, 0, 23, 59, 59);
        return { start, end };
    };

    const { start: startThisMonth, end: endThisMonth } = getMonthRange(currMonth, currYear);
    const { start: startLastMonth, end: endLastMonth } = getMonthRange(prevMonth, prevMonthYear);

    // Count enrollments
    const [totalEnrollments, enrollmentsThisMonth, enrollmentsLastMonth] = await Promise.all([
        Enrollment.countDocuments(),
        Enrollment.countDocuments({ createdAt: { $gte: startThisMonth, $lte: endThisMonth } }),
        Enrollment.countDocuments({ createdAt: { $gte: startLastMonth, $lte: endLastMonth } })
    ]);

    const topAllTimeAgg = await Enrollment.aggregate([
        { $group: { _id: "$course", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    let topCourseAllTime = null;
    let topCourseAllTimeEnrollments = 0;

    if (topAllTimeAgg.length > 0) {
        const courseId = topAllTimeAgg[0]._id;
        topCourseAllTimeEnrollments = topAllTimeAgg[0].count;
        topCourseAllTime = await Course.findById(courseId).select("title thumbnail");
    }

    const topThisMonthAgg = await Enrollment.aggregate([
        { $match: { createdAt: { $gte: startThisMonth, $lte: endThisMonth } } },
        { $group: { _id: "$course", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    let topCourseThisMonth = null;
    let topCourseThisMonthEnrollments = 0;

    if (topThisMonthAgg.length > 0) {
        const courseId = topThisMonthAgg[0]._id;
        topCourseThisMonthEnrollments = topThisMonthAgg[0].count;
        topCourseThisMonth = await Course.findById(courseId).select("title thumbnail");
    }
    return res.status(200).json({
        totalEnrollments,
        enrollmentsLastMonth,
        enrollmentsThisMonth,
        topCourseAllTime,
        topCourseThisMonth,
        topCourseAllTimeEnrollments,
        topCourseThisMonthEnrollments
    });
};


module.exports.getMonthlyGrowth = async (req, res, next) => {
    const currDate = new Date();
    const currMonth = currDate.getMonth(); // 0–11
    const currYear = currDate.getFullYear();

    // Handle previous month and year (January case)
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const prevMonthYear = currMonth === 0 ? currYear - 1 : currYear;

    // Helper to get start & end of a month
    const getMonthRange = (month, year) => {
        const start = new Date(year, month, 1, 0, 0, 0);
        const end = new Date(year, month + 1, 0, 23, 59, 59);
        return { start, end };
    };

    // Month ranges
    const { start: startThisMonth, end: endThisMonth } = getMonthRange(currMonth, currYear);
    const { start: startLastMonth, end: endLastMonth } = getMonthRange(prevMonth, prevMonthYear);

    const [
        tutorsThisMonth,
        tutorsLastMonth,
        coursesThisMonth,
        coursesLastMonth,
        studentsThisMonth,
        studentsLastMonth
    ] = await Promise.all([
        Tutor.countDocuments({ createdAt: { $gte: startThisMonth, $lte: endThisMonth } }),
        Tutor.countDocuments({ createdAt: { $gte: startLastMonth, $lte: endLastMonth } }),
        Course.countDocuments({ createdAt: { $gte: startThisMonth, $lte: endThisMonth } }),
        Course.countDocuments({ createdAt: { $gte: startLastMonth, $lte: endLastMonth } }),
        User.countDocuments({ createdAt: { $gte: startThisMonth, $lte: endThisMonth } }),
        User.countDocuments({ createdAt: { $gte: startLastMonth, $lte: endLastMonth } })
    ]);
    return res.status(200).json({
        tutorsThisMonth,
        tutorsLastMonth,
        coursesThisMonth,
        coursesLastMonth,
        studentsThisMonth,
        studentsLastMonth
    });

}

