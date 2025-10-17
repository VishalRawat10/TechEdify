const express = require("express");
const discussionController = require("../controllers/discussion.controller.js");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { authenticateTutor, isCourseTutor, isAuthenticated, isDiscussionUser, isDiscussionMember } = require("../middlewares/middlewares.js");


router.route("/").get(isAuthenticated, wrapAsync(discussionController.getDiscussions)).post(authenticateTutor, isCourseTutor, wrapAsync(discussionController.createDiscussion))

router.route("/:id/messages").get(isAuthenticated, isDiscussionMember, wrapAsync(discussionController.getAllMessages));

module.exports = router;