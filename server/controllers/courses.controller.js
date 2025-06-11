const Course = require("../models/course");
const User = require("../models/user");
const Review = require("../models/review");
const Instructor = require("../models/instructor");
const { validationResult } = require("express-validator");

module.exports.getPublishedCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ publishStatus: "published" }).populate("instructor");
        if (courses)
            return res.status(200).json({ courses });
        else
            res.status(500).json({ message: "Internal server error!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports.getCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate({
            path: "reviews", populate: {
                path: "author",
                select: "fullname"
            }
        }).populate("instructor");
        if (course) {
            return res.status(200).json({ course, message: "Course fetched succesfully." });
        } else {
            return res.status(400).json({ message: "Course not found." });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

//enroll
module.exports.enroll = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    const user = await User.findById(req.user._id);
    if (!course) {
        return res.status(400).json({ message: "Course does not exist!" });
    }
    if (user.coursesEnrolled.includes(course._id)) return res.status(400).json({ message: "You are already enrolled to the course!" });
    try {
        user.coursesEnrolled.push(course);
        course.enrolledStudents.push(req.user);
        await course.save();
        await user.save();
        res.status(200).json({ message: "Enrolled to the course successfully!", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
}

//get all courses of instructor
module.exports.instructorCourses = async (req, res, next) => {
    try {
        const response = await Instructor.findById(req.user.instructorId).populate("myCourses");
        return res.status(200).json({ message: "Courses fetched successfully!", myCourses: response.myCourses });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}

//get course for instructor
module.exports.getInstructorCourse = async (req, res, next) => {
    return res.status(200).json({ course: req.course, message: "Course fetched successfully!" });
}


//create course 
module.exports.createCourse = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array().map((err) => err.msg).join(" ") });
    }
    if (!req.file) {
        return res.status(500).json({ message: "Internal server error!", error: "Error in cloudinary!" });
    }
    const { name, about, alias, price, chapters } = req.body;
    console.log(req.file);
    try {
        console.log(req.user._id);
        const parsedChapters = JSON.parse(chapters);
        const course = new Course({
            name, about, alias, price, chapters: parsedChapters, profileImg: req.file.path, instructor: req.user.instructorId
        });
        req.instructor.myCourses.push(course._id);
        await req.instructor.save();
        await course.save();

        return res.status(201).json({ message: "Course created successfully.", course });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
}


//edit course
module.exports.editCourse = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array().map((err) => err.msg).join(" ") });
    }
    const { name, about, alias, price, chapters } = req.body;

    try {
        req.course.name = name;
        req.course.about = about;
        req.course.alias = alias;
        req.course.price = price;
        req.course.chapters = JSON.parse(chapters);
        // const result = await cloudinary.uploader.destroy(req.course.profileImg.filename);
        // if (result.result === "not found") return res.status(400).json({ message: "Image not found!" });
        req.course.profileImg = req.file.path;
        await req.course.save();
        return res.status(200).json({ message: "Course updated successfully!", course: req.course })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error! Unable to update course.", error: err.message })
    }
}




