const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const lectureController = require("../controllers/lecture.controller.js");
const { authMiddleware } = require("../middlewares/authMiddlewares.js");
const { isEnrolledStudent, isCourseInstructor } = require("../middlewares/courses.middleware.js");

router.route("/:courseId/lectures").get(authMiddleware, isEnrolledStudent, lectureController.getLectures);
router.route("/:courseId/instructor/lectures").get(authMiddleware, isCourseInstructor, lectureController.getLectures).post(authMiddleware, isCourseInstructor, [body("title").isLength({ min: 10 }).withMessage("Lecture title must be minimum 10 character long."), body("description").notEmpty().withMessage("Description is required."), body("lectureUrl").notEmpty().withMessage("Video url is required."), body("thumbnailUrl").notEmpty().withMessage("Thumbnail url is required.")], lectureController.addLecture);

module.exports = router;