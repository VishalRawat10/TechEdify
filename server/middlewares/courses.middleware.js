const Lecture = require("../models/lecture");
const Instructor = require("../models/instructor");
const Course = require("../models/course");

module.exports.isEnrolledStudent = async (req, res, next) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
        return res.status(400).json({ message: "Course not found!", success: false });
    }
    if (req.user.coursesEnrolled.includes(courseId)) {
        req.course = course;
        return next();
    }
    return res.status(401).json({ message: "Unauthorized!", success: true, error: "not logged in" });
}

module.exports.isCourseInstructor = async (req, res, next) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("instructor").populate("lectures");
    console.log(course);
    if (!course) {
        return res.status(400).json({ message: "Course not found!", success: false });
    }

    if (course.instructor.userId.toString() === req.user._id.toString()) {
        req.course = course;
        return next();
    }

    return res.status(401).json({ message: "Unathorized!", success: false });
}

