const express = require("express");
const multer = require("multer");
const { authenticateTutor, isCourseTutor, isDiscussionMember, isAuthenticated } = require("../middlewares/middlewares");
const wrapAsync = require("../utils/wrapAsync");
const tutorController = require("../controllers/tutor.controller");
const router = express.Router();
const { TutorStorage } = require("../config/cloudinary.config");
const upload = multer({ storage: TutorStorage });

//tutors for home page
router.route("/home-page").get(wrapAsync(tutorController.getTutorsForHomePage));

//Tutor routes
router.route("/login").post(wrapAsync(tutorController.login));
router.route("/logout").post(authenticateTutor, wrapAsync(tutorController.logout));

// get profile and update profile 
router.route("/profile").get(authenticateTutor, wrapAsync(tutorController.getProfile)).put(authenticateTutor, upload.single("profileImage"), wrapAsync(tutorController.updateProfile));

//dashboard overview
router.route("/dashboard").get(authenticateTutor, wrapAsync(tutorController.getDashboardStats));

//get tutor courses
router.route("/courses").get(authenticateTutor, wrapAsync(tutorController.getCourses));

//get tutor courses that are not discussed
router.route("/courses/undiscussed").get(authenticateTutor, wrapAsync(tutorController.getUndiscussedCourses));

//get tutor course
router.route("/courses/:id").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getCourse));

//get-tutor course lectures
router.route("/courses/:id/lectures").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getCourseLectures));

//get-lecture for tutor
router.route("/courses/:id/lectures/:lectureId").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getCourseLecture));

//Get tutor discussions
router.route("/discussions").get(authenticateTutor, wrapAsync(tutorController.getDiscussions));
router.route("/discussions/:discussionId/messages").get(authenticateTutor, isDiscussionMember, wrapAsync(tutorController.getDiscussionMessages));
router.route("/messages/unread").get(authenticateTutor, wrapAsync(tutorController.getUnreadMessages));

router.route("/undiscussed-users").get(authenticateTutor, wrapAsync(tutorController.getUndiscussedUsers));

module.exports = router;