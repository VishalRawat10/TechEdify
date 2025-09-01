const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const ExpressError = require('../utils/ExpressError');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const LectureStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const lecNo = req.course.lectures.indexOf(req.params.lectureId) === -1 ? req.course.lectures.length + 1 : req.course.lectures.indexOf(req.params.lectureId) + 1;
        return {
            folder: `TechEdify/courses/${req.course._id}/lectures/lecture${lecNo}`,
            resource_type: "auto",
            public_id: file.fieldname === "lectureVideo" ? "video" : file.fieldname,
        }
    }
});

const CourseStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        if (!file) {
            return next(new ExpressError(400, "Thumbnail file is required!"))
        }
        return {
            folder: `TechEdify/courses/${req.params.id}`,
            resource_type: 'auto',
            public_id: "thumbnail"
        }
    }
});

const UserStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: `TechEdify/Users/${req.user._id}`,
            resource_type: 'auto',
            public_id: "profile-image"
        }
    }
});

const TutorStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: `TechEdify/Tutors/${req.tutor._id}`,
            resource_type: 'auto',
            public_id: "profile-image"
        }
    }
});

module.exports = { cloudinary, UserStorage, TutorStorage, LectureStorage, CourseStorage };