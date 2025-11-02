const express = require("express");
const multer = require("multer");
const { authenticateTutor, isCourseTutor, isDiscussionMember, isAuthenticated } = require("../middlewares/middlewares");
const wrapAsync = require("../utils/wrapAsync");
const tutorController = require("../controllers/tutor.controller");
const router = express.Router();
const { TutorStorage, CourseStorage } = require("../config/cloudinary.config");
const tutorUploader = multer({ storage: TutorStorage });
const courseUploader = multer({ storage: CourseStorage });
const upload = multer({ dist: "uploads/" })

//home-page
router.route("/home-page").get(wrapAsync(tutorController.getTutorsForHomePage));

//auth-routes
router.route("/login").post(wrapAsync(tutorController.login));
router.route("/logout").post(authenticateTutor, wrapAsync(tutorController.logout));

//profile routes
router.route("/profile").get(authenticateTutor, wrapAsync(tutorController.getProfile)).put(authenticateTutor, tutorUploader.single("profileImage"), wrapAsync(tutorController.updateProfile));

//dashboard overview
router.route("/dashboard").get(authenticateTutor, wrapAsync(tutorController.getDashboardStats));

//courses routes
router.route("/courses").get(authenticateTutor, wrapAsync(tutorController.getCourses)).post(authenticateTutor, upload.single("thumbnail"), wrapAsync(tutorController.createCourse));
router.route("/courses/undiscussed").get(authenticateTutor, wrapAsync(tutorController.getUndiscussedCourses));
router.route("/courses/:id").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getCourse)).put(authenticateTutor, courseUploader.single("thumbnail"), wrapAsync(tutorController.updateCourse)).delete(authenticateTutor, wrapAsync(tutorController.destroyCourse));
router.route("/courses/:id/lectures").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getCourseLectures)).post(authenticateTutor, isCourseTutor, wrapAsync(tutorController.uploadLecture));
router.route("/courses/:id/lectures/:lectureId").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getCourseLecture)).put(authenticateTutor, isCourseTutor, wrapAsync(tutorController.editLecture)).delete(authenticateTutor, isCourseTutor, wrapAsync(tutorController.destroyLecture));

//Discussion routes
router.route("/discussions").get(authenticateTutor, wrapAsync(tutorController.getDiscussions)).post(authenticateTutor, wrapAsync(tutorController.createDiscussion));
router.route("/undiscussed-users").get(authenticateTutor, wrapAsync(tutorController.getUndiscussedUsers));
router.route("/discussions/:discussionId/messages").get(authenticateTutor, isDiscussionMember, wrapAsync(tutorController.getDiscussionMessages));
router.route("/unread-messages").get(authenticateTutor, wrapAsync(tutorController.getUnreadMessages));

module.exports = router;