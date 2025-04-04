const Course = require("../models/course");
const Review = require("../models/review");

module.exports.addReview = async (req, res) => {
    const { courseId } = req.params;
    const { comment, rating } = req.body;

    if (!comment || !rating) {
        return res.status(400).json({ message: "Rating and comment are required!", success: false });
    }

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(400).json({ message: "Course does not exists!", success: false });
    }

    try {
        const review = new Review({
            comment,
            rating,
            author: req.user,
            course,
        });
        course.reviews.push(review);
        await review.save();
        await course.save();
        res.status(200).json({ message: "Review added successfully. ", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error.", success: false, error: err.message });
    }
}

//Delete review
module.exports.deleteReview = async (req, res) => {
    const { reviewId, courseId } = req.params;
    try {
        const course = await Course.findByIdAndUpdate(courseId, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ message: "Review deleted successfully. ", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error.", success: false, error: err.message });
    }
}
