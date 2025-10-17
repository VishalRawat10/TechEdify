const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
const Tutor = require("../models/tutor");
const Course = require("../models/course");
const Lecture = require("../models/lecture");
const Discussion = require("../models/discussion");
const Message = require("../models/message");
const Enrollment = require("../models/enrollment");
const BlacklistToken = require("../models/blacklistToken");
const { tutorSchema } = require("../config/joiSchema.config");

module.exports.getTutorsForHomePage = async (req, res, next) => {
    const tutors = await Tutor.aggregate([{ $sample: { size: 3 } }]);
    return res.status(200).json({ tutors, message: "Tutors fetched successfully!" });
}

module.exports.getDashboardStats = async (req, res, next) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [courses, publishedCourses, unpublishedCourses, ongoingCourses, completedCourses, upcomingCourses, lastMonthCourses, thisMonthCourses] = await Promise.all([
        await Course.find({ tutor: req.tutor._id }),
        await Course.find({ tutor: req.tutor._id, isPublished: true }),
        await Course.find({ tutor: req.tutor._id, isPublished: false }),
        await Course.find({ tutor: req.tutor._id, courseStatus: "ongoing" }),
        await Course.find({ tutor: req.tutor._id, courseStatus: "completed" }),
        await Course.find({ tutor: req.tutor._id, courseStatus: "upcoming" }),
        await Course.find({ tutor: req.tutor._id, createdAt: { $gte: lastMonth, $lt: thisMonth } }),
        await Course.find({ tutor: req.tutor._id, createdAt: { $gte: thisMonth } })
    ]);

    const coursesIds = courses.map((course) => course._id);

    const [enrollments, lastMonthEnrollements, thisMonthEnrollments, lastMonthLectures, thisMonthLectures] = await Promise.all([
        await Enrollment.find({ course: { $in: coursesIds } }),
        await Enrollment.find({
            course: { $in: coursesIds }, createdAt: { $gte: lastMonth, $lt: thisMonth }
        }),
        await Enrollment.find({
            course: { $in: coursesIds }, createdAt: { $gte: thisMonth }
        }),
        await Lecture.find({ tutor: req.tutor._id, createdAt: { $gte: lastMonth, $lt: thisMonth } }),
        await Lecture.find({ tutor: req.tutor._id, createdAt: { $gte: thisMonth } })
    ]);

    return res.status(200).json({
        totalCourses: courses.length,
        publishedCourses: publishedCourses.length,
        unpublishedCourses: unpublishedCourses.length,
        ongoingCourses: ongoingCourses.length,
        completedCourses: completedCourses.length,
        upcomingCourses: upcomingCourses.length,
        lastMonthCourses: lastMonthCourses.length,
        thisMontCourses: thisMonthCourses.length,
        totalEnrollments: enrollments.length,
        lastMonthEnrollements: lastMonthEnrollements.length,
        thisMonthEnrollments: thisMonthEnrollments.length,
        thisMonthLectures: thisMonthLectures.length,
        lastMonthLectures: lastMonthLectures.length
    });

}

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ExpressError(401, "Invalid email or password!"));
    }
    const tutor = await Tutor.findOne({ email }).select("+password").populate("myCourses");
    if (!tutor) {
        return next(new ExpressError(400, "Incorrect email or password!"));
    }
    const matched = await bcrypt.compare(password, tutor.password);
    if (matched) {
        tutor.password = null;
        const tutorToken = jwt.sign({ _id: tutor._id }, process.env.TUTOR_JWT_SECRET_KEY, { expiresIn: process.env.TUTOR_JWT_EXPIRES_IN });
        return res.status(200).cookie("tutorToken", tutorToken, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000
        }).json({ tutor, message: "Tutor logged in successfully!" });
    }
    return next(new ExpressError(401, "Incorrect email or password!"));
}

module.exports.logout = async (req, res, next) => {
    const tutorToken = req.signedCookies.tutorToken;
    const blacklistToken = new BlacklistToken({
        token: tutorToken,
    });
    await blacklistToken.save();
    return res.status(200).clearCookie(tutorToken, { signed: true }).json({ message: "Tutor logged out successfully!" });
}

module.exports.getProfile = async (req, res, next) => {
    return res.status(200).json({ tutor: req.tutor });
}

module.exports.getCourses = async (req, res, next) => {
    // const courses = await Course.find({ tutor: req.tutor._id }).select("+lectures +enrolledStudents");
    const courses = await Course.find().select("+lectures +enrolledStudents");

    return res.status(200).json({ courses, message: "All courses fetched successfully!" })
}

module.exports.getCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id).select("+lectures +enrolledStudents").populate("lectures");
    if (!course) {
        return next(new ExpressError(400, "Course not found!"));
    }
    return res.status(200).json({ course, message: "Course fetched successfully!" });
}

module.exports.getCourseLectures = async (req, res, next) => {
    const { id } = req.params;
    const lectures = await Lecture.find({ course: id }).populate("course", "title");
    return res.status(200).json({ lectures, message: "Lectures fetched successfully!" });
}

module.exports.getCourseLecture = async (req, res, next) => {
    const { lectureId, id } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        return next(new ExpressError(400, "Lecture not found!"));
    }
    return res.status(200).json({ lecture, message: "Lecture fetched successfully!" });
}

module.exports.updateProfile = async (req, res, next) => {
    const { fullname, email, personalEmail, contact, message } = req.body;

    const updatedTutor = { fullname, email, personalEmail, contact, message };

    const error = tutorSchema.validate(updatedTutor);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }

    if (req.file) updatedTutor.profileImage = {
        url: req.file.pathname,
        filename: req.file.filename,
    }
    const tutor = await Tutor.findByIdAndUpdate(req.tutor._id, updatedTutor, { new: true });

    return res.status(200).json({ tutor, message: "Profile updated!" });
}

module.exports.getDiscussions = async (req, res, next) => {
    const discussions = await Discussion.find({ "members.member": req.tutor._id }).populate("course", "title thumbnail").populate("members.member", "fullname profileImage").populate({ path: "lastMessage", populate: { path: "sender", select: "fullname profileImage createdAt" }, select: "content sender senderModel" });

    return res.status(200).json({ message: "Discussions fetched successfully!", discussions });
}

module.exports.getUndiscussedCourses = async (req, res, next) => {
    const discussions = await Discussion.find({ "members.member": req.tutor._id, type: "course" }).populate("course", "_id");

    const discussedCourses = discussions.map((discussion) => {
        return discussion.course._id;
    });

    const undiscussedCourses = await Course.find({ tutor: req.tutor._id, _id: { $nin: discussedCourses } });

    return res.status(200).json({ message: "Undiscussed courses fetched successfully!", undiscussedCourses });
}

module.exports.getDiscussionMessages = async (req, res, next) => {
    const { discussionId } = req.params;

    const messages = await Message.find({ discussion: discussionId }).populate("sender", "fullname profileImage").populate({
        path: "discussion",
        populate: {
            path: "course",
            select: "title thumbnail"
        }
    });

    return res.status(200).json({ message: "Messages fetched successfully!", messages });
}

module.exports.getUnreadMessages = async (req, res, next) => {
    const discussions = (await Discussion.find({ "members.member": req.tutor._id })).map((discussion) => discussion._id);

    const unreadMessages = await Message.find({ discussion: { $in: discussions }, sender: { $ne: req.tutor._id }, readBy: { $ne: req.tutor._id } }).populate("sender", "fullname profileImage");

    return res.status(200).json({ unreadMessages, message: "Undelivered message fetched successfully!" });

}

module.exports.getUndiscussedUsers = async (req, res, next) => {
    const discussions = await Discussion.find({ "members.member": req.tutor._id, type: "private" }).select("members.member");

    const discussedUsers = discussions.map((discussion) => discussion.members[1].member);

    const undiscussedUsers = await User.find({ _id: { $nin: discussedUsers } }).select("fullname profileImage");

    return res.status(200).json({ undiscussedUsers, message: "Undiscussed users fetched successfully!" });
}