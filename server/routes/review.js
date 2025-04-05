const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const reviewController = require("../controllers/review.controller");
const { isReviewAuthor } = require("../middlewares/isReviewAuthor");

const router = express.Router();

//Add new review
router.route("/:courseId/reviews/new").post(authMiddleware, reviewController.addReview);

//Delete review
router.route("/:courseId/reviews/:reviewId").delete(authMiddleware, isReviewAuthor, reviewController.deleteReview);

module.exports = router;