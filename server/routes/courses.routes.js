const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller.js");
const { isAuthenticated, authenticateTutor, authenticateAdmin, isCourseTutor, isEnrolled } = require("../middlewares/middlewares.js");
const multer = require('multer');
const { storage } = require("../config/cloudinary.config.js");
const wrapAsync = require("../utils/wrapAsync.js");
const upload = multer({ storage });

//get all courses and create course
router.route("/").get(authenticateAdmin, wrapAsync(coursesController.getAllCourses)).post(isAuthenticated, authenticateTutor, upload.single("profileImage"), wrapAsync(coursesController.createCourse));

//get published courses
router.route("/published").get(wrapAsync(coursesController.getPublishedCourses));

//get the course, edit course
router.route("/:id").get(wrapAsync(coursesController.getCourse)).put(isAuthenticated, isCourseTutor, upload.single("profileImage"), wrapAsync(coursesController.editCourse));

//enroll to course
router.route("/:id/enroll").post(isAuthenticated, wrapAsync(coursesController.enroll));

//publish course
router.route("/:id/publish").put(authenticateAdmin, wrapAsync(coursesController.publishCourse));

//unpublish course
router.route("/:id/unpublish").put(authenticateAdmin, wrapAsync(coursesController.unpublishCourse));

//see all lectures of course, upload lecture
router.route("/:id/lectures").get(isAuthenticated, isEnrolled, wrapAsync(coursesController.getLectures)).post(authenticateTutor, wrapAsync(coursesController.uploadLecture));

//get lecture, edit lecture and delete lecture
router.route("/:id/lectures/:lectureId").get(isAuthenticated, isEnrolled, wrapAsync(coursesController.getLecture)).put(authenticateTutor, isCourseTutor, wrapAsync(coursesController.updateLecture)).delete(authenticateTutor, isCourseTutor, wrapAsync(coursesController.destroyLecture));

module.exports = router;

