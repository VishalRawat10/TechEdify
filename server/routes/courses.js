const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller.js");
const { wrapAsync } = require("../utils/wrapAsync.js");
const { authMiddleware } = require("../middlewares/authMiddlewares.js");

router.route("/").get(wrapAsync(coursesController.courses));
router.route("/:id").get(wrapAsync(coursesController.showCourse));
router.route("/:id/buy").post(authMiddleware, wrapAsync(coursesController.buy))

module.exports = router;