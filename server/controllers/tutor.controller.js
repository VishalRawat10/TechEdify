const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
const Tutor = require("../models/tutor");
const Course = require("../models/course");
const Lecture = require("../models/lecture");
const BlacklistToken = require("../models/blacklistToken");
const { tutorSchema } = require("../config/joiSchema.config");
const { cloudinary } = require("../config/cloudinary.config");

module.exports.getTutorsForHomePage = async (req, res, next) => {
    const tutors = await Tutor.aggregate([{ $sample: { size: 3 } }]);
    return res.status(200).json({ tutors, message: "Tutors fetched successfully!" });
}

module.exports.getTutors = async (req, res, next) => {
    const tutors = await Tutor.find();
    return res.status(200).json({ tutors });
}

module.exports.getTutor = async (req, res, next) => {
    const { id } = req.params;
    const tutor = await Tutor.findById(id).populate("myCourses");
    return res.status(200).json({ tutor });
}

module.exports.suspend = async (req, res, next) => {
    const { id } = req.params;
    const tutor = await Tutor.findByIdAndUpdate(id, { isSuspended: true }, { new: true });
    return res.status(200).json({ tutor, message: "Tutor is suspended!" });
}

module.exports.unsuspend = async (req, res, next) => {
    const { id } = req.params;
    const tutor = await Tutor.findByIdAndUpdate(id, { isSuspended: false }, { new: true });
    return res.status(200).json({ tutor, message: "Tutor is unsuspended!" });
}

module.exports.createTutor = async (req, res, next) => {
    const { fullname, password, email, phone, message, isSuspended, personalEmail } = req.body;
    const { error } = tutorSchema.validate({ fullname, email, message, personalEmail });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    if (!password) {
        return next(new ExpressError(400, "Password is required!"));
    }

    if (await Tutor.findOne({ $or: [{ email }, { personalEmail }, { phone }] })) {
        return next(new ExpressError(400, "Tutor exists with given email or personalEmail or phone!"))
    };
    const hashPassword = await bcrypt.hash(password, 10);
    const tutor = new Tutor(
        { fullname, password: hashPassword, email, phone, message, isSuspended, personalEmail }
    );
    await tutor.save();
    return res.status(201).json({ message: "Tutor created successfully!", tutor });
}

module.exports.destroyTutor = async (req, res, next) => {
    const { id } = req.params;
    const tutor = await Tutor.findByIdAndDelete(id);
    return res.status(200).json({ message: "Tutor deleted successfully!" });
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

module.exports.getTutorCourses = async (req, res, next) => {
    // const courses = await Course.find({ tutor: req.tutor._id }).select("+lectures +enrolledStudents");
    const courses = await Course.find().select("+lectures +enrolledStudents");

    return res.status(200).json({ courses, message: "All courses fetched successfully!" })
}

module.exports.getTutorCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id).select("+lectures +enrolledStudents").populate("lectures");
    if (!course) {
        return next(new ExpressError(400, "Course not found!"));
    }
    return res.status(200).json({ course, message: "Course fetched successfully!" });
}

module.exports.getTutorCourseLectures = async (req, res, next) => {
    const { id } = req.params;
    const lectures = await Lecture.find({ course: id }).populate("course", "title");
    return res.status(200).json({ lectures, message: "Lectures fetched successfully!" });
}

module.exports.getTutorCourseLecture = async (req, res, next) => {
    const { lectureId, id } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        return next(new ExpressError(400, "Lecture not found!"));
    }
    return res.status(200).json({ lecture, message: "Lecture fetched successfully!" });
}

module.exports.updateProfile = async (req, res, next) => {
    const { fullname, email, personalEmail, phone, message } = req.body;
    const error = tutorSchema.validate({ fullname, email, personalEmail, phone, message });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    const tutor = await Tutor.findByIdAndUpdate(req.tutor._id, { fullname, email, personalEmail, phone, message }, { new: true });

    return res.status(200).json({ tutor, message: "Profile updated!" });
}

module.exports.updateProfileImage = async (req, res, next) => {
    const tutor = await Tutor.findByIdAndUpdate(req.tutor._id, {
        profileImage: {
            url: req.file.path,
            filename: req.file.filname,
        }
    }, { new: true });
    return res.status(200).json({ tutor, message: "Profile photo updated successfully!" });
}

module.exports.removeProfileImage = async (req, res, next) => {
    const result = await cloudinary.uploader.destroy(req.tutor.profileImage.filename);
    if (result.result === "not found") return next(new ExpressError(400, "Image not found!"));
    const tutor = await Tutor.findByIdAndUpdate(req.user._id, { profileImage: { url: "", filename: "" } }, { new: true });
    return res.status(200).json({ tutor, message: "Profile image removed successfully!" });
}

