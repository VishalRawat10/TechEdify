const express = require("express");
const multer = require("multer");
const { authenticateAdmin, authenticateTutor, isCourseTutor } = require("../middlewares/middlewares");
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
router.route("/profile").get(authenticateTutor, wrapAsync(tutorController.getProfile)).put(authenticateTutor, wrapAsync(tutorController.updateProfile));

// upload profileImage and remove profile image 
router.route("/profile/profileImage").put(authenticateTutor, upload.single("profileImage"), wrapAsync(tutorController.updateProfileImage)).delete(authenticateTutor, wrapAsync(tutorController.removeProfileImage));

//get tutor courses
router.route("/courses").get(authenticateTutor, wrapAsync(tutorController.getTutorCourses));

//get tutor courses
router.route("/courses/:id").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getTutorCourse));

//get-tutor courses
router.route("/courses/:id/lectures").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getTutorCourseLectures));

//get-lectures for tutor
router.route("/courses/:id/lectures/:lectureId").get(authenticateTutor, isCourseTutor, wrapAsync(tutorController.getTutorCourseLecture));



//Admin routes
// show tutors, create tutor 
router.route("/").get(authenticateAdmin, wrapAsync(tutorController.getTutors)).post(authenticateAdmin, wrapAsync(tutorController.createTutor));

// show tutor, delete tutor 
router.route("/:id").get(authenticateAdmin, wrapAsync(tutorController.getTutor)).delete(authenticateAdmin, wrapAsync(tutorController.destroyTutor));

// suspend tutor 
router.route("/:id/suspend").put(authenticateAdmin, wrapAsync(tutorController.suspendTutor));

//remove suspension from tutor 
router.route("/:id/unsuspend").put(authenticateAdmin, wrapAsync(tutorController.unsuspendTutor));


module.exports = router;