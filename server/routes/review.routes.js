const express = require("express");
const reviewController = require("../controllers/review.controller");
const { isReviewAuthor, isAuthenticated } = require("../middlewares/middlewares.js");

const router = express.Router();

//Add new review
router.route("/:courseId/reviews").post(isAuthenticated, reviewController.addReview);

//Delete review
router.route("/:courseId/reviews/:reviewId").delete(isAuthenticated, isReviewAuthor, reviewController.deleteReview);

module.exports = router;