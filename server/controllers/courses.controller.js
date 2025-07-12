const User = require("../models/user");
const Tutor = require("../models/tutor");
const Course = require("../models/course");
const Lecture = require("../models/lecture");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { courseSchema, lectureSchema } = require("../config/joiSchema.config");

module.exports.getPublishedCourses = async (req, res, next) => {
    const courses = await Course.find({ publishStatus: "published" }).populate("tutor");
    return res.status(200).json({ courses });
}

module.exports.getCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findOne({ $and: [{ _id: id }, { publishStatus: "unpublished" }] }).populate({
        path: "reviews", populate: {
            path: "author",
            select: "fullname"
        }
    }).populate("tutor");
    if (!course) {
        return next(new ExpressError(400, "Course does not exist!"));
    }
    return res.status(200).json({ course, message: "Course fetched succesfully." });
}

//enroll
module.exports.enroll = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
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
    const { title, description, alias, price, chapters } = req.body;
    const error = courseSchema.validate({ title, description, alias, price, chapters })
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    const parsedChapters = JSON.parse(chapters);
    const course = new Course({
        title, description, alias, price, chapters: parsedChapters, profileImg: req.file.path, tutor: req.tutor._id
    });
    req.tutor.myCourses.push(course._id);
    await req.tutor.save();
    await course.save();

    return res.status(201).json({ message: "Course created successfully.", course });
}


//edit course
module.exports.editCourse = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, alias, price, chapters } = req.body;
    const error = courseSchema.validate({ title, description, alias, price, chapters });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(" | ");
        return next(new ExpressError(400, errMsg));
    }
    if (!req.file) return next(new ExpressError(400, "Unable to update profile image!"));
    const result = await cloudinary.uploader.destroy(req.course.profileImage.filename);
    if (result.result === "not found") {
        return next(new ExpressError(400, "Couldn't delete previous profile image!"));
    }
    const course = await Course.findByIdAndUpdate(id, { title, description, alias, price, chapters: JSON.parse(chapters), profileImage: { url: req.file.path, filename: req.file.filename } }, { new: true, runValidators: true });
    return res.status(200).json({ message: "Course updated successfully!", course });
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
    const lectures = await Lecture.find({ courseId: id });
    return res.status(200).json({ lectures, message: "Lectures fetched successfully!" });
}

//Create lecture
module.exports.uploadLecture = async (req, res, next) => {
    const { id } = req.params;
    if (!req.files) {
        return next(new ExpressError(400, "Unable to upload files!"));
    }
    const { title, description, status } = req.body;
    const error = lectureSchema.validate({
        title, description, status, lectureVideo: {
            url: req.files.lectureVideo.secure_url,
            filename: req.files.lectureVideo.public_id
        }, thumbnail: {
            url: req.files.thumbnail.secure_url,
            filename: req.files.thumbnail.public_id
        }
    });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
    const lecture = new Lecture({
        title, description, status, lectureVideo: {
            url: req.files.lectureVideo.secure_url,
            filename: req.files.lectureVideo.public_id
        }, thumbnail: {
            url: req.files.thumbnail.secure_url,
            filename: req.files.thumbnail.public_id
        },
        notes: {
            url: req.files.notes.secure_url,
            filename: req.files.notes.public_id
        },
        assignment: {
            url: req.files.assignment.secure_url,
            filename: req.files.assignment.public_id
        }
    });
    const course = await Course.findByIdAndUpdate(id, { $push: { lectures: lecture._id } }, { new: true });
    await lecture.save();
    return res.status(201).json({ message: "Lecture created successfully!", lecture, course });
}


//Get lecture 
module.exports.getLecture = async (req, res, next) => {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
        return next(new ExpressError(400, "Lecture does not exists!"));
    }
    return res.status(200).json({ message: "Lecture fetched successfully!", lecture });
}

//Edit lecture
module.exports.editLecture = async (req, res, next) => {
    const { lectureId } = req.params;
    if (!req.files) {
        return next(new ExpressError(400, "Unable to upload files!"));
    }
    const { title, description, status } = req.body;
    const error = lectureSchema.validate({
        title, description, status, lectureVideo: {
            url: req.files.lectureVideo.secure_url,
            filename: req.files.lectureVideo.public_id
        }, thumbnail: {
            url: req.files.thumbnail.secure_url,
            filename: req.files.thumbnail.public_id
        }
    });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
    const lecture = await Lecture.findByIdAndUpdate(lectureId, {
        title, description, status, lectureVideo: {
            url: req.files.lectureVideo.secure_url,
            filename: req.files.lectureVideo.public_id
        }, thumbnail: {
            url: req.files.thumbnail.secure_url,
            filename: req.files.thumbnail.public_id
        },
        notes: {
            url: req.files.notes.secure_url,
            filename: req.files.notes.public_id
        },
        assignment: {
            url: req.files.assignment.secure_url,
            filename: req.files.assignment.public_id
        }
    }, { new: true, runValidators: true });

    return res.status(200).json({ message: "Lecture upated successfully!", lecture });
}

//destroy lecture
module.exports.destroyLecture = async (req, res, next) => {

}

