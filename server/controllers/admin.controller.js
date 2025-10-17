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

//Courses Controllers
module.exports.getAllCourses = async (req, res, next) => {
    const courses = await Course.find().select("+enrolledStudents +lectures").populate("tutor", "fullname profileImage");

    return res.status(200).json({ message: "Courses fetched successfully!", courses });
}

module.exports.updateCoursePublishStatus = async (req, res, next) => {
    const { courseId } = req.params;
    const { isPublished } = req.body;

    const course = await Course.findByIdAndUpdate(courseId, { isPublished }, { new: true }).populate("tutor", "fullname profileImage").select("+enrolledStudents +lectures");

    if (!course) {
        return next(new ExpressError(400, "Course not found!"));
    }

    return res.status(200).json({ course, message: isPublished ? "Course is published!" : "Course is unpublished!" });
}

module.exports.deleteCourse = async (req, res, next) => {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
        return next(new ExpressError(400, "Course not found!"));
    }

    return res.status(200).json({ message: "Course is deleted!", course });
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


//Stats controller
module.exports.getOverviewStats = async (req, res, next) => {
    const [courses, tutors, students, payments] = await Promise.all([await Course.find(), await Tutor.find(), await User.find(), await Payment.find()]);

    const totalRevenue = payments.reduce((sum, payment) => {
        return sum + payment.amount;
    }, 0)

    return res.status(200).json({ totalCourses: courses.length, totalTutors: tutors.length, totalStudents: students.length, totalRevenue })
}

module.exports.getEnrollmentStats = async (req, res, next) => {
    const enrollments = await Enrollment.find().populate("course", "title thumbnail");

    const totalEnrollments = enrollments.length;
    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();

    // Enrollments last month
    const enrollmentsLastMonth = enrollments.reduce((sum, enrollment) => {
        const date = new Date(enrollment.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();

        // Handle January (previous month = December of last year)
        if (
            (currMonth === 0 && month === 11 && year === currYear - 1) ||
            (month === currMonth - 1 && year === currYear)
        ) {
            return sum + 1;
        }
        return sum;
    }, 0);

    // Enrollments this month
    const enrollmentsThisMonth = enrollments.reduce((sum, enrollment) => {
        const date = new Date(enrollment.createdAt);
        if (date.getMonth() === currMonth && date.getFullYear() === currYear) return sum + 1;
        return sum;
    }, 0);

    // Top course all-time
    const counts = {};
    for (const e of enrollments) {
        const id = e.course._id.toString();
        counts[id] = (counts[id] || 0) + 1;
    }
    const mostEnrolledCourseId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const topCourseAllTime = enrollments.find(e => e.course._id.toString() === mostEnrolledCourseId).course;
    const topCourseAllTimeEnrollments = counts[mostEnrolledCourseId];

    // Top course this month
    const thisMonthEnrollments = enrollments.filter(e => {
        const date = new Date(e.createdAt);
        return date.getMonth() === currMonth && date.getFullYear() === currYear;
    });

    const thisMonthCounts = {};
    for (const e of thisMonthEnrollments) {
        const id = e.course._id.toString();
        thisMonthCounts[id] = (thisMonthCounts[id] || 0) + 1;
    }

    let topCourseThisMonth = null;
    if (Object.keys(thisMonthCounts).length > 0) {
        const topCourseThisMonthId = Object.entries(thisMonthCounts).sort((a, b) => b[1] - a[1])[0][0];
        topCourseThisMonth = thisMonthEnrollments.find(e => e.course._id.toString() === topCourseThisMonthId).course;
    }

    const topCourseThisMonthEnrollments = thisMonthCounts[topCourseThisMonth?._id?.toString()];

    return res.status(200).json({
        totalEnrollments,
        enrollmentsLastMonth,
        enrollmentsThisMonth,
        topCourseAllTime,
        topCourseThisMonth,
        topCourseAllTimeEnrollments,
        topCourseThisMonthEnrollments
    });


}

module.exports.getMonthlyGrowth = async (req, res, next) => {
    const [courses, tutors, students] = await Promise.all([await Course.find(), await Tutor.find(), await User.find()]);

    const currMonth = new Date().getMonth();
    const currYear = new Date().getFullYear();

    const tutorsLastMonth = tutors.filter((tutor) => new Date(tutor.createdAt).getFullYear === currYear && new Date(tutor.createdAt).getMonth() === currMonth - 1).length;

    const tutorsThisMonth = tutors.filter((tutor) => new Date(tutor.createdAt).getFullYear === currYear && new Date(tutor.createdAt).getMonth() === currMonth).length;

    const coursesLastMonth = tutors.filter((course) => new Date(course.createdAt).getFullYear === currYear && new Date(course.createdAt).getMonth() === currMonth - 1).length;

    const coursesThisMonth = courses.filter((course) => new Date(course.createdAt).getFullYear === currYear && new Date(course.createdAt).getMonth() === currMonth).length;

    const studentsLastMonth = students.filter((student) => new Date(student.createdAt).getFullYear === currYear && new Date(student.createdAt).getMonth() === currMonth - 1).length;

    const studentsThisMonth = students.filter((student) => new Date(student.createdAt).getFullYear === currYear && new Date(student.createdAt).getMonth() === currMonth).length;

    return res.status(200).json({ studentsLastMonth, studentsThisMonth, coursesLastMonth, coursesThisMonth, tutorsLastMonth, tutorsThisMonth });

}

