const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
const Tutor = require("../models/tutor");
const User = require("../models/user");
const Course = require("../models/course");
const Lecture = require("../models/lecture");
const Discussion = require("../models/discussion");
const Message = require("../models/message");
const Enrollment = require("../models/enrollment");
const BlacklistToken = require("../models/blacklistToken");
const { tutorSchema, courseSchema, lectureSchema } = require("../config/joiSchema.config");

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
            sameSite: 'None',
            secure: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000
        }).json({ tutor, message: "Tutor logged in successfully!" });
    }
    return next(new ExpressError(401, "Incorrect email or password!"));
}

module.exports.logout = async (req, res, next) => {
    const blacklistToken = new BlacklistToken({
        token: req.token,
    });
    await blacklistToken.save();
    return res.status(200).clearCookie("tutorToken", { signed: true }).json({ message: "Tutor logged out successfully!" });
}

module.exports.getProfile = async (req, res, next) => {
    return res.status(200).json({ tutor: req.tutor });
}

module.exports.updateProfile = async (req, res, next) => {
    const { fullname, email, personalEmail, contact, message } = req.body;

    const updatedTutor = { fullname, email, personalEmail, contact, message };

    const { error } = tutorSchema.validate(updatedTutor);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }

    if (req.file) updatedTutor.profileImage = {
        url: req.file.path,
        filename: req.file.filename,
    }

    const tutor = await Tutor.findByIdAndUpdate(req.tutor._id, updatedTutor, { new: true });

    return res.status(200).json({ tutor, message: "Profile updated successfully!" });
}


//Courses controllers ================================================
module.exports.getCourses = async (req, res, next) => {
    const courses = await Course.find({ tutor: req.tutor._id }).select("+lectures +enrolledStudents");

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

//create course 
module.exports.createCourse = async (req, res, next) => {
    const { title, description, alias, price, chapters } = req.body;
    const { error } = courseSchema.validate({ title, description, alias, price, chapters });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    if (await Course.findOne({ title })) {
        return next(new ExpressError(400, "Course exists with same title! Please change the title."));
    }
    const parsedChapters = JSON.parse(chapters);

    if (!req.file) {
        return next(new ExpressError(500, "Thumbnail is required!"));
    }

    const course = new Course({
        title, description, alias, price, chapters: parsedChapters, tutor: req.tutor._id
    });

    // upload file to cloudinary 
    const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: "thumbnail",
        folder: `TechEdify/courses/${course._id}`,
        resource_type: "auto", // Automatically detect resource type (image, video, etc.)
        overwrite: true,
    });

    course.thumbnail = {
        url: result.secure_url,
        filename: result.public_id
    }

    req.tutor.myCourses.push(course._id);
    await req.tutor.save();
    await course.save();

    return res.status(201).json({ message: "Course created successfully!", course });
}

//update course
module.exports.updateCourse = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, alias, price, chapters, courseStatus } = req.body;

    const { error } = courseSchema.validate({ title, description, alias, price, chapters, courseStatus });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    if (req.file) {
        const course = await Course.findByIdAndUpdate(id, { title, description, alias, price, courseStatus, chapters: JSON.parse(chapters), thumbnail: { url: req.file.path, filename: req.file.filename } }, { new: true, runValidators: true }).select("+lectures +enrolledStudents").populate("lectures");
        return res.status(200).json({ message: "Course updated successfully!", course });
    } else {
        const course = await Course.findByIdAndUpdate(id, { title, description, alias, price, courseStatus, chapters: JSON.parse(chapters) }, { new: true, runValidators: true }).select("+lectures +enrolledStudents").populate("lectures");
        return res.status(200).json({ message: "Course updated successfully!", course });
    }
}

//destory course
module.exports.destroyCourse = async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    const tutor = await Tutor.findByIdAndUpdate(id, { $pull: { myCourses: id } }, { new: true, runValidators: true });

    return res.status(200).json({ message: "Course deleted successfully!", course, tutor });
}


//Lecture controllers ===============================================
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

//Upload lecture
module.exports.uploadLecture = async (req, res, next) => {
    const { id } = req.params;

    if (Object.keys(req.files).length < 2) {
        return next(new ExpressError(400, "Unable to upload files!"));
    }

    const lectureVideo = {
        url: req.files.lectureVideo[0].path,
        filename: req.files.lectureVideo[0].filename
    }
    const thumbnail = {
        url: req.files.thumbnail[0].path,
        filename: req.files.thumbnail[0].filename
    }
    const notes = req.files?.notes ? {
        url: req.files.notes[0].path,
        filename: req.files.notes[0].filename
    } : {
        url: "",
        filename: ""
    };
    const assignment = req.files?.assignment ? {
        url: req.files.assignment[0].path,
        filename: req.files.assignment[0].filename
    } : {
        url: "",
        filename: ""
    };

    const { title, description } = req.body;
    const { error } = lectureSchema.validate({
        title, description, status, publicId
    });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }

    if (await Lecture.findOne({ title })) {
        return next(new ExpressError(400, "Lecture with same title exists!"));
    }

    const lecture = new Lecture({
        title, description, thumbnail, notes, assignment, lectureVideo, tutor: req.tutor._id, course: id
    });

    await lecture.save();
    const course = await Course.findByIdAndUpdate(id, { $push: { lectures: lecture._id } }, { new: true, runValidators: true });
    return res.status(201).json({ message: "Lecture uploaded successfully!", lecture, course });
}

//Edit lecture
module.exports.editLecture = async (req, res, next) => {
    const { lectureId } = req.params;
    const { title, description } = req.body;

    const updatedLecture = { title, description };
    if (req.files.lectureVideo) {
        updatedLecture.publicId = req.files.lectureVideo[0].filename;
        updatedLecture.lectureVideo = {
            filename: req.files.lectureVideo[0].filename,
            url: req.files.lectureVideo[0].path
        }
    }
    if (req.files.thumbnail) {
        updatedLecture.thumbnail = {
            filename: req.files.thumbnail[0].filename,
            url: req.files.thumbnail[0].path
        }
    }
    if (req.files.notes) {
        updatedLecture.notes = {
            filename: req.files.notes[0].filename,
            url: req.files.notes[0].path
        }
    }
    if (req.files.assignment) {
        updatedLecture.assignment = {
            filename: req.files.assignment[0].filename,
            url: req.files.assignment[0].path
        }
    }

    const { error } = lectureSchema.validate({ title, description });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }

    const lecture = await Lecture.findByIdAndUpdate(lectureId, updatedLecture, { new: true, runValidators: true });

    return res.status(200).json({ message: "Lecture upated successfully!", lecture });
}

module.exports.destroyLecture = async (req, res, next) => {
    const { id, lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    const course = await Course.findByIdAndUpdate(id, { $pull: { lectures: lectureId } });

    return res.status(200).json({ message: "Lecture deleted successfully!", course, lecture });
}


//Discussion Controllers ============================================
module.exports.getDiscussions = async (req, res, next) => {
    const discussions = await Discussion.find({ "members.member": req.tutor._id }).populate("course", "title thumbnail").populate("members.member", "fullname profileImage").populate({ path: "lastMessage", populate: { path: "sender", select: "fullname profileImage createdAt" }, select: "content sender senderModel" });

    return res.status(200).json({ message: "Discussions fetched successfully!", discussions });
}

//create discussion
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