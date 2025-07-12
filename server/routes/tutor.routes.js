const express = require("express");
const multer = require("multer");
const { authenticateAdmin, authenticateTutor } = require("../middlewares/middlewares");
const wrapAsync = require("../utils/wrapAsync");
const tutorController = require("../controllers/tutor.controller");
const router = express.Router();
const { storage } = require("../config/cloudinary.config");
const upload = multer({ storage });

//Admin routes
// show tutors, create tutor 
router.route("/").get(authenticateAdmin, wrapAsync(tutorController.getTutors)).post(authenticateAdmin, wrapAsync(tutorController.createTutor));
// show tutor, delete tutor 
router.route("/:id").get(authenticateAdmin, wrapAsync(tutorController.getTutor)).delete(authenticateAdmin, wrapAsync(tutorController.destroyTutor));
// suspend tutor 
router.route("/:id/suspend").put(authenticateAdmin, wrapAsync(tutorController.suspendTutor));
//remove suspension from tutor 
router.route("/:id/unsuspend").put(authenticateAdmin, wrapAsync(tutorController.unsuspendTutor));


//Tutor routes
router.route("/login").post(wrapAsync(tutorController.login));
router.route("/logout").post(wrapAsync(authenticateTutor, tutorController.logout));
// get profile and update profile 
router.route("/profile").get(authenticateTutor, wrapAsync(tutorController.getProfile)).put(authenticateTutor, wrapAsync(tutorController.updateProfile));
// upload profileImage and remove profile image 
router.route("/profile/profileImage").put(authenticateTutor, upload.single("profileImage"), wrapAsync(tutorController.updateProfileImage)).delete(authenticateTutor, wrapAsync(tutorController.removeProfileImage));

module.exports = router;