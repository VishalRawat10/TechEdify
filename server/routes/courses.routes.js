const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller.js");
const { isAuthenticated, authenticateTutor, authenticateAdmin, isCourseTutor, isEnrolled } = require("../middlewares/middlewares.js");
const multer = require('multer');
const { LectureStorage, CourseStorage } = require("../config/cloudinary.config.js");
const wrapAsync = require("../utils/wrapAsync.js");
const LectureUpload = multer({ storage: LectureStorage });
const CourseUpload = multer({ storage: CourseStorage });

//get courses for home page
router.route("/home-page").get(wrapAsync(coursesController.getCoursesForHomePage));

//get published courses
router.route("/published").get(wrapAsync(coursesController.getPublishedCourses));

//get the course, edit course
router.route("/:id").get(wrapAsync(coursesController.getCourse));

//enroll to course
router.route("/:id/enroll").post(isAuthenticated, wrapAsync(coursesController.enroll));

//see all lectures of course, Upload lecture
router.route("/:id/lectures").get(isAuthenticated, isEnrolled, wrapAsync(coursesController.getLectures));

//get lecture, edit lecture and delete lecture
router.route("/:id/lectures/:lectureId").get(isAuthenticated, isEnrolled, wrapAsync(coursesController.getLecture));


module.exports = router;

