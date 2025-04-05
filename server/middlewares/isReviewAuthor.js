const Review = require("../models/review");

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(400).json({ message: "Review does not exist.", success: false });
    }

    if (req.user._id.toString() === review.author.toString()) {
        return next();
    }
    return res.status(401).json({ message: "You are not the author of the review.", success: false });
}