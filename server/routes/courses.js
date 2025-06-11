const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller.js");
const { wrapAsync } = require("../utils/wrapAsync.js");
const { authMiddleware, isInstructor } = require("../middlewares/authMiddlewares.js");
const { isCourseInstructor } = require("../middlewares/courses.middleware.js");
const { body } = require("express-validator");
const multer = require('multer');
const { storage } = require("../services/cloudinaryConfig.js");
const upload = multer({ storage });
//Student
router.route("/").get(wrapAsync(coursesController.getPublishedCourses));
router.route("/:id").get(wrapAsync(coursesController.getCourse));
router.route("/:id/enroll").post(authMiddleware, wrapAsync(coursesController.enroll));

//Instructor
//show-my-courses
router.route("/instructor/my-courses").get(authMiddleware, wrapAsync(coursesController.instructorCourses));

//show a course
router.route("/instructor/my-courses/:courseId").get(authMiddleware, isCourseInstructor, coursesController.getInstructorCourse);

//create a course
router.route("/instructor/my-courses/new").post(authMiddleware, isInstructor, upload.single("profileImg"), [body("name").isString().isLength({ min: 10 }).withMessage("Course name should be at least 10 alphabate long."), body("about").isLength({ min: 10 }).withMessage("About should be at least 10 alphabate long."), body("alias").isLength({ min: 10 }).withMessage("Course alias should be at least 10 alphabate long."), body("price").notEmpty().withMessage("Course price must minimum 1 INR."), body("chapters").notEmpty().withMessage("Add at least one chapter.")], coursesController.createCourse);

//edit a course
router.route("/instructor/my-courses/:courseId/edit").put(authMiddleware, isCourseInstructor, upload.single("profileImg"), [body("name").isLength({ min: "10" }).withMessage("Course name should be at least 10 alphabate long."), body("about").isLength({ min: "10" }).withMessage("About should be at least 10 alphabate long."), body("alias").isLength({ min: "10" }).withMessage("Course alias should be at least 10 alphabate long."), body("price").isNumeric({ min: 1 }).withMessage("Course price must minimum 1 INR."), body("chapters").notEmpty().withMessage("Add at least one chapter.")], coursesController.editCourse);
module.exports = router;


1