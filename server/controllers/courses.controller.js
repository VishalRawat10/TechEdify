const Course = require("../models/course");
const User = require("../models/user");

module.exports.courses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        if (courses)
            return res.status(200).json(courses);
        else
            res.status(500).json({ message: "Internal server error!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

module.exports.getCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (course) {
            return res.status(200).json(course);
        } else {
            return res.status(400).json({ message: "Course not found." });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.buy = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    const user = await User.findById(req.user._id);
    if (!course) {
        return res.status(401).json({ message: "Course does not exist!" });
    }
    try {
        user.coursesEnrolled.push(course);
        await user.save();
        res.status(200).json({ message: "Course purchased successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
}

