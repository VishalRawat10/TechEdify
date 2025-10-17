const Discussion = require("../models/discussion");
const Message = require("../models/message");
const Course = require("../models/course");
const ExpressError = require("../utils/ExpressError");

module.exports.getDiscussions = async (req, res, next) => {
    const discussions = await Discussion.find({ "members.member": req.user._id }).populate("course", "title thumbnail").populate("members.member", "fullname profileImage").populate({ path: "lastMessage", populate: { path: "sender", select: "fullname profileImage createdAt" }, select: "content sender senderModel" });

    return res.status(200).json({ discussions, message: "Discussions fetched successfully!" });
}

module.exports.createDiscussion = async (req, res, next) => {
    const { courseId, userId } = req.body;

    const course = await Course.findById(courseId).select("enrolledStudents");

    if (await Discussion.findOne({ course: courseId })) {
        return next(new ExpressError(400, "Course alread has a discussion!"));
    }

    const students = courseId ? course.enrolledStudents.map((id) => {
        return { member: id, memberModel: "User" };
    }) : [{ member: userId, memberModel: "User" }];


    const discussion = new Discussion({
        course: courseId,
        members: [{ member: req.tutor._id, memberModel: "Tutor" }, ...students],
        type: course ? "course" : "private"
    });

    await discussion.save();
    discussion.course = course;

    return res.status(201).json({ message: "Discussion created successfully!", discussion });
}

module.exports.getAllMessages = async (req, res, next) => {
    const { id } = req.params;

    const messages = await Message.find({ discussion: id }).populate("sender", "fullname profileImage").populate({
        path: "discussion", populate: {
            path: "course",
            select: "title thumbnail"
        }
    });

    return res.status(200).json({ message: "Messages fetched successfully!", messages });
}