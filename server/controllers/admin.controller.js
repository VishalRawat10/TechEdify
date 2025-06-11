const { validationResult } = require("express-validator");
const Admin = require("../models/admin");
const Course = require("../models/course");
const User = require("../models/user");
const Instructor = require("../models/instructor");
const Review = require("../models/review");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.verify = async (req, res, next) => {
    console.log(req.device.name, req.device.type, req.device.browser);
    if (req.admin.isTempPassword) {
        return res.status(200).json({ admin: req.admin, message: "Create new password to continue." })
    }
    return res.status(200).json({ admin: req.admin })
}

module.exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array().map((err) => err.msg).join(" ") });
    }
    const { adminEmail, adminPassword } = req.body;
    try {
        const admin = await Admin.findOne({ companyEmail: adminEmail }).select("+password");

        //IS ADMIN DOES NOT EXIST WITH GIVEN EMAIL
        if (!admin) {
            return res.status(401).json({ message: "Incorrect email or password!" });
        }

        //CHECKING IF IT IS TEMPORARY PASSWORD
        if (admin.isTempPassword) {
            if (admin.password === adminPassword) {
                const adminToken = jwt.sign({ _id: admin._id }, process.env.ADMIN_JWT_SECRET_KEY, { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN });
                res.cookie("adminToken", adminToken, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    signed: true,
                    maxAge: 10 * 60 * 60 * 1000
                });
                return res.status(200).json({ message: "Create new password to continue.", admin });
            } else {
                return res.status(401).json({ message: "Incorrect email or password!" });
            }
        }

        const isMatch = await bcrypt.compare(adminPassword, admin.password, 10);
        if (isMatch) {
            const adminToken = jwt.sign({ _id: admin._id }, process.env.ADMIN_JWT_SECRET_KEY, { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN });
            res.cookie("adminToken", adminToken, {
                httpOnly: true,
                sameSite: 'Strict',
                signed: true,
                maxAge: 10 * 60 * 60 * 1000
            });
            return res.status(200).json({ message: "Logged in successfully!", admin });
        }
        return res.status(401).json({ message: "Incorrect email or password." });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}

module.exports.logout = async (req, res, next) => {
    res.status(200).clearCookie("adminToken", { signed: true }).json({ message: "Logged out successfulyy" });
}

//get all courses - admin
module.exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor");
        if (courses)
            return res.status(200).json({ courses });
        else
            res.status(500).json({ message: "Internal server error!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

//unpublish course - by admin
module.exports.unpublish = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId).populate("instructor");

        if (!course) {
            return res.status(400).json({ message: "Course not found!" });
        }
        course.publishStatus = "unpublished";
        await course.save();
        return res.status(200).json({ message: "Course is unpublished.", course });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}

//publish course - by admin
module.exports.publish = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId).populate("instructor");
        if (!course) {
            return res.status(400).json({ message: "Course not found!" });
        }
        course.publishStatus = "published";
        await course.save();
        return res.status(200).json({ message: "Course is published.", course });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}


//delete course
module.exports.deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findByIdAndDelete(courseId);
        return res.status(200).json({ message: "Course deleted successfylly!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error! Course not deleted!", error: err.message })
    }
}
//get students
module.exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "student" });
        return res.status(200).json({ students, message: "Students fetched successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to fetch students!", error: err.message });
    }
}

//get individual student
module.exports.getStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await User.findById(studentId).populate("coursesEnrolled");
        if (!student) {
            return res.status(400).json({ message: "Student does not exist." });
        }
        return res.status(200).json({ message: "Student details fetched successfully.", student });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}

module.exports.suspendStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(400).json({ message: "Student not found!" });
        }
        student.isSuspended = true;
        await student.save();
        return res.status(200).json({ message: "Student suspended successfully.", student });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Could not suspend student.", error: err.message });
    }
}

module.exports.unsuspendStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(400).json({ message: "Student not found!" });
        }
        student.isSuspended = false;
        await student.save();
        return res.status(200).json({ message: "Student unsuspended successfully.", student });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Could not unsuspend student.", error: err.message });
    }
}

//destroy student
module.exports.destroyStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        await User.findByIdAndDelete(studentId);
        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error! Unable to delete student.", error: err.message });
    }
}

//get instructors
module.exports.getInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.find();
        return res.status(200).json({ instructors, message: "Instructors fetched successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to fetch instructors!", error: err.message });
    }
}


//create instructor
module.exports.createInstructor = async (req, res) => {
    const { firstname, lastname, email, password, messageToStudent, phone } = req.body;
    if (!firstname || !email || !password || !messageToStudent) {
        return res.status(400).json({ message: "Fill all required fields!" });
    }
    if (!req.file) {
        return res.status(500).json({ message: "Internal server error!" });
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname: {
                firstname, lastname
            },
            email,
            profileImg: {
                url: req.file.path,
                filename: req.file.filename,
            },
            password: hashPassword,
            phone,
            isTempPassword: true,
            role: "instructor",
        });
        const instructor = new Instructor({
            name: firstname + " " + lastname,
            userId: user._id,
            profileImg: req.file.path,
        });
        user.instructorId = instructor._id;

        await user.save();
        await instructor.save();
        return res.status(201).json({ message: "Instructor created successfully!", instructor })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", error: err.message })
    }
}

module.exports.suspendInstructor = async (req, res) => {
    const { instructorId } = req.params;
    try {
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return res.status(400).json({ message: "Instructor not found!" });
        }
        instructor.isSuspended = true;
        await instructor.save();
        return res.status(200).json({ message: "Instructor suspended successfully.", instructor });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Could not suspend instructor.", error: err.message });
    }
}

module.exports.unsuspendInstructor = async (req, res) => {
    const { instructorId } = req.params;
    try {
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return res.status(400).json({ message: "Instructor not found!" });
        }
        instructor.isSuspended = false;
        await instructor.save();
        return res.status(200).json({ message: "Instructor unsuspended successfully.", instructor });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Could not unsuspend instructor.", error: err.message });
    }
}

