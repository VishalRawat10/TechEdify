const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
    }
});

module.exports = model("Review", reviewSchema);