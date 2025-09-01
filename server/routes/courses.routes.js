const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller.js");
const { isAuthenticated, authenticateTutor, authenticateAdmin, isCourseTutor, isEnrolled } = require("../middlewares/middlewares.js");
const multer = require('multer');
const { LectureStorage, CourseStorage } = require("../config/cloudinary.config.js");
const wrapAsync = require("../utils/wrapAsync.js");
const LectureUpload = multer({ storage: LectureStorage });
const CourseUpload = multer({ storage: CourseStorage });

//get all courses and create course
router.route("/").get(authenticateAdmin, wrapAsync(coursesController.getAllCourses)).post(authenticateTutor, CourseUpload.single("thumbnail"), wrapAsync(coursesController.createCourse));

//get courses for home page
router.route("/home-page").get(wrapAsync(coursesController.getCoursesForHomePage));

//get published courses
router.route("/published").get(wrapAsync(coursesController.getPublishedCourses));

//get the course, edit course
router.route("/:id").get(wrapAsync(coursesController.getCourse)).put(authenticateTutor, isCourseTutor, CourseUpload.single("thumbnail"), wrapAsync(coursesController.editCourse));

//enroll to course
router.route("/:id/enroll").post(isAuthenticated, wrapAsync(coursesController.enroll));

//publish course
router.route("/:id/publish").put(authenticateAdmin, wrapAsync(coursesController.publishCourse));

//unpublish course
router.route("/:id/unpublish").put(authenticateAdmin, wrapAsync(coursesController.unpublishCourse));

//see all lectures of course, Upload lecture
router.route("/:id/lectures").get(isAuthenticated, isEnrolled, wrapAsync(coursesController.getLectures)).post(authenticateTutor, isCourseTutor, LectureUpload.fields([{ name: "lectureVideo", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }, { name: "notes", maxCount: 1 }, { name: "assignment", maxCount: 1 }]), wrapAsync(coursesController.uploadLecture));

//get lecture, edit lecture and delete lecture
router.route("/:id/lectures/:lectureId").get(isAuthenticated, isEnrolled, wrapAsync(coursesController.getLecture)).put(authenticateTutor, isCourseTutor, LectureUpload.fields([{ name: "lectureVideo", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }, { name: "notes", maxCount: 1 }, { name: "assignment", maxCount: 1 }]), wrapAsync(coursesController.editLecture)).delete(authenticateTutor, isCourseTutor, wrapAsync(coursesController.destroyLecture));

//get lecture video signed url
router.get("/:id/lectures/:lectureId/lecture-url", isAuthenticated, isEnrolled, wrapAsync(coursesController.getLectureVideoUrl));

module.exports = router;

