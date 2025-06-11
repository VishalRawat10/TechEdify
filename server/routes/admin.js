const express = require("express");
const { wrapAsync } = require("../utils/wrapAsync");
const adminController = require("../controllers/admin.controller.js");
const router = express.Router();
const { body } = require("express-validator");
const { adminAuthMiddleware } = require("../middlewares/adminAuthMiddlewares.js");
const multer = require("multer");
const { storage } = require("../services/cloudinaryConfig.js");
const upload = multer({ storage });

//auth routes
router.route("/verify").get(adminAuthMiddleware, adminController.verify);
router.route("/login").post([body("adminEmail").notEmpty().withMessage("Admin email is required!"), body("adminPassword").notEmpty().withMessage("Admin password is required!")], adminController.login);
router.route("/logout").post(adminAuthMiddleware, adminController.logout);

//courses routes
router.route("/courses").get(adminAuthMiddleware, adminController.getAllCourses);
router.route("/courses/:courseId/publish").put(adminAuthMiddleware, adminController.publish);
router.route("/courses/:courseId/unpublish").put(adminAuthMiddleware, adminController.unpublish);
router.route("/courses/:courseId").delete(adminAuthMiddleware, adminController.deleteCourse);

//student routes
router.route("/students").get(adminAuthMiddleware, adminController.getStudents);//get all students
router.route("/students/:studentId").get(adminAuthMiddleware, adminController.getStudent);//get individual student
router.route("/students/:studentId/suspend").put(adminAuthMiddleware, adminController.suspendStudent);//suspend student
router.route("/students/:studentId/unsuspend").put(adminAuthMiddleware, adminController.unsuspendStudent);//remove suspension

router.route("/students/:studentId").delete(adminAuthMiddleware, adminController.destroyStudent);//destroy route

//instructor routes
router.route("/instructors").get(adminAuthMiddleware, adminController.getInstructors).post(adminAuthMiddleware, upload.single("profileImg"), adminController.createInstructor);
router.route("/instructors/:instructorId/suspend").put(adminAuthMiddleware, adminController.suspendInstructor);
router.route("/instructors/:instructorId/unsuspend").put(adminAuthMiddleware, adminController.unsuspendInstructor);
module.exports = router;