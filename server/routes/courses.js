const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller.js");
const { wrapAsync } = require("../utils/wrapAsync.js");
const { authMiddleware } = require("../middlewares/authMiddlewares.js");

//Student
router.route("/").get(wrapAsync(coursesController.courses));
router.route("/:id").get(wrapAsync(coursesController.getCourse));
router.route("/:id/enroll").post(authMiddleware, wrapAsync(coursesController.enroll))

module.exports = router;