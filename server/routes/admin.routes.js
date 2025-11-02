const express = require("express");
const adminController = require("../controllers/admin.controller.js");
const router = express.Router();
const { authenticateAdmin } = require("../middlewares/middlewares");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { AdminStorage } = require("../config/cloudinary.config.js");
const upload = multer({ storage: AdminStorage });

//auth routes
router.route("/profile").get(authenticateAdmin, wrapAsync(adminController.getProfile)).put(authenticateAdmin, upload.single("profileImage"), wrapAsync(adminController.updateProfile));
router.route("/profile/change-password").patch(authenticateAdmin, wrapAsync(adminController.changePassword));
router.route("/login").post(wrapAsync(adminController.login));
router.route("/logout").post(authenticateAdmin, wrapAsync(adminController.logout));


//courses routes
router.route("/courses").get(authenticateAdmin, wrapAsync(adminController.getAllCourses)).post(authenticateAdmin, wrapAsync(adminController.createTutor));
router.route("/courses/:courseId").delete(authenticateAdmin, wrapAsync(adminController.destroyCourse));
router.route("/courses/:courseId/publish-status").patch(authenticateAdmin, wrapAsync(adminController.updateCoursePublishStatus));


//tutors routes
router.route("/tutors").get(authenticateAdmin, wrapAsync(adminController.getAllTutors)).post(authenticateAdmin, wrapAsync(adminController.createTutor));
router.route("/tutors/:tutorId").delete(authenticateAdmin, wrapAsync(adminController.destroyTutor));
router.route("/tutors/:tutorId/status").patch(authenticateAdmin, wrapAsync(adminController.updateTutorStatus));


//student/user routes
router.route("/students").get(authenticateAdmin, wrapAsync(adminController.getAllStudents));
router.route("/students/:studentId").delete(authenticateAdmin, wrapAsync(adminController.destroyStudent));
router.route("/students/:studentId/status").patch(authenticateAdmin, wrapAsync(adminController.updateStudentStatus));

//stats routes
router.route("/overview-stats").get(authenticateAdmin, wrapAsync(adminController.getOverviewStats));
router.route("/enrollment-stats").get(authenticateAdmin, wrapAsync(adminController.getEnrollmentStats));
router.route("/monthly-growth").get(authenticateAdmin, wrapAsync(adminController.getMonthlyGrowth));


module.exports = router;