const Course = require("../models/course");
const Lecture = require("../models/lecture");
const ExpressError = require("../utils/ExpressError");

module.exports.getAllCourses = async (req, res, next) => {
    const courses = await Course.find().select("+enrolledStudents").populate("tutor", "fullname profileImage");

    return res.status(200).json({ message: "Courses fetched successfully!", courses });
}

module.exports.getPublishedCourses = async (req, res, next) => {
    const courses = await Course.find({ isPublished: true }).select("-enrolledStudents -lectures").populate("tutor");
    return res.status(200).json({ courses });
}

module.exports.getCoursesForHomePage = async (req, res, next) => {
    const courses = await Course.aggregate([{ $match: { isPublished: true } }, { $sample: { size: 3 } }, {
        $lookup: {
            from: "tutors",
            localField: "tutor",
            foreignField: "_id",
            as: "tutor"
        }
    },
    { $unwind: "$tutor" }]);
    return res.status(200).json({ courses, message: "Courses fetched successfully!" });
}

//get course
module.exports.getCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findOne({ $and: [{ _id: id }, { isPublished: true }] }).select("-lectures -enrolledStudents").populate("tutor", "fullname profileImage message");
    if (!course) {
        return next(new ExpressError(400, "Course does not exist!"));
    }
    return res.status(200).json({ course, message: "Course fetched succesfully." });
}

//enroll
module.exports.enroll = async (req, res, next) => {
    if (req.user.isSuspended) {
        return next(new ExpressError(403, "Your account has been suspended. You can't enroll to any course!"));
    }
    const { id } = req.params;
    const course = await Course.findById(id).select("+enrolledStudents");
    if (!course) {
        return next(new ExpressError(400, "Course does not exist!"));
    }
    if (req.user.enrolledCourses.includes(course._id)) return next(new ExpressError(400, "You are already enrolled to the course!"));
    req.user.enrolledCourses.push(course);
    course.enrolledStudents.push(req.user);
    await course.save();
    await req.user.save();
    return res.status(200).json({ message: "Enrolled to the course successfully!", user: req.user });
}

//Get lectures
module.exports.getLectures = async (req, res, next) => {
    const { id } = req.params;
    const lectures = await Lecture.find({ course: id }).select("title publicId description notes assignment lectureVideo");

    return res.status(200).json({ lectures, message: "Lectures fetched successfully!", course: req.course });
}

//Get lecture 
module.exports.getLecture = async (req, res, next) => {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
        return next(new ExpressError(400, "Lecture does not exists!"));
    }
    lecture.lectureVideo.url = signedUrl;
    return res.status(200).json({ message: "Lecture fetched successfully!", lecture });
}



