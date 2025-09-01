const User = require("../models/user");
const Tutor = require("../models/tutor");
const Course = require("../models/course");
const Lecture = require("../models/lecture");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { courseSchema, lectureSchema } = require("../config/joiSchema.config");
const { cloudinary } = require("../config/cloudinary.config");

module.exports.getPublishedCourses = async (req, res, next) => {
    const courses = await Course.find({ publishStatus: "published" }).populate("tutor");
    return res.status(200).json({ courses });
}

module.exports.getCoursesForHomePage = async (req, res, next) => {
    const courses = await Course.aggregate([{ $sample: { size: 3 } }]);
    return res.status(200).json({ courses, message: "Courses fetched successfully!" });
}

//get course
module.exports.getCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findOne({ $and: [{ _id: id }, { publishStatus: "published" }] }).populate({
        path: "reviews", populate: {
            path: "author",
            select: "fullname"
        }
    }).populate("tutor", "fullname profileImage message");
    if (!course) {
        return next(new ExpressError(400, "Course does not exist!"));
    }
    return res.status(200).json({ course, message: "Course fetched succesfully." });
}

//enroll
module.exports.enroll = async (req, res, next) => {
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

//create course 
module.exports.createCourse = async (req, res, next) => {
    if (!req.file) {
        return next(new ExpressError(500, "Error in cloudinary!"));
    }
    const { title, description, alias, price, chapters, type } = req.body;
    const { error } = courseSchema.validate({ title, description, alias, price, chapters, type })
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    if (await Course.findOne({ title })) {
        return next(new ExpressError(400, "Course exists with same title! Please change the title."));
    }
    const parsedChapters = JSON.parse(chapters);
    const course = new Course({
        title, description, alias, price, chapters: parsedChapters, thumbnail: { url: req.file.path, filename: req.file.filename }, tutor: req.tutor._id, type
    });
    req.tutor.myCourses.push(course._id);
    await req.tutor.save();
    await course.save();

    return res.status(201).json({ message: "Course created successfully!", course });
}


//edit course
module.exports.editCourse = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, alias, price, chapters, type } = req.body;
    const { error } = courseSchema.validate({ title, description, alias, price, chapters, type });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    if (req.file) {
        const course = await Course.findByIdAndUpdate(id, { title, type, description, alias, price, chapters: JSON.parse(chapters), thumbnail: { url: req.file.path, filename: req.file.filename } }, { new: true, runValidators: true }).select("+lectures +enrolledStudents").populate("lectures");
        return res.status(200).json({ message: "Course updated successfully!", course });
    } else {
        const course = await Course.findByIdAndUpdate(id, { title, type, description, alias, price, chapters: JSON.parse(chapters) }, { new: true, runValidators: true }).select("+lectures +enrolledStudents").populate("lectures");
        return res.status(200).json({ message: "Course updated successfully!", course });
    }
}

//Publish course
module.exports.publishCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { publishStatus: "publish" }, { new: true });
    if (!course) {
        return next(new ExpressError(400, "Course does not exist!"));
    }
    return res.status(200).json({ message: "Course published successfully!", course });
}

//Unpublish course
module.exports.unpublishCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { publishStatus: "unpublish" }, { new: true });
    if (!course) {
        return next(new ExpressError(400, "Course does not exist!"));
    }
    return res.status(200).json({ message: "Course unpublished successfully!", course });
}

//Get lectures
module.exports.getLectures = async (req, res, next) => {
    const { id } = req.params;
    const lectures = await Lecture.find({ course: id }).select("title publicId description notes assignment lectureVideo");

    return res.status(200).json({ lectures, message: "Lectures fetched successfully!", course: req.course });
}

//Upload lecture
module.exports.uploadLecture = async (req, res, next) => {
    const { id } = req.params;

    if (Object.keys(req.files).length < 2) {
        return next(new ExpressError(400, "Unable to upload files!"));
    }

    const publicId = req.files.lectureVideo[0].filename;//for signed url
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

    const { title, description, status } = req.body;
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
        title, description, status, publicId, thumbnail, notes, assignment, lectureVideo, tutor: req.tutor._id, course: id
    });

    await lecture.save();
    const course = await Course.findByIdAndUpdate(id, { $push: { lectures: lecture._id } }, { new: true });
    return res.status(201).json({ message: "Lecture uploaded successfully!", lecture, course });
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

//getLectureVideo
module.exports.getLectureVideoUrl = async (req, res, next) => {
    const { lectureId } = req.params;
    console.log(lectureId);
    const lecture = await Lecture.findOne({ _id: lectureId }).select("publicId title");
    const signedUrl = cloudinary.url(lecture.publicId + ".m3u8", {
        resource_type: 'video',
        type: "private",
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1hour expiration time
        transformation: [
            { streaming_profile: "hd", flags: "streaming" }
        ],
    });

    if (!signedUrl) {
        return next(new ExpressError(500, "Couldn't get lecture url!"));
    }
    return res.status(200).json({ lectureUrl: signedUrl });
}

//Edit lecture
module.exports.editLecture = async (req, res, next) => {
    const { lectureId } = req.params;
    const { title, description, status, publicId } = req.body;

    const updatedLecture = { title, description, status, publicId };
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

    const { error } = lectureSchema.validate({ title, description, status, publicId });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }

    const lecture = await Lecture.findByIdAndUpdate(lectureId, updatedLecture, { new: true, runValidators: true });

    return res.status(200).json({ message: "Lecture upated successfully!", lecture });
}

//destroy lecture
module.exports.destroyLecture = async (req, res, next) => {

}

