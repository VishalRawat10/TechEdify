const { Schema, model } = require("mongoose");

const courseProgressSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        enum: ["ongoing", "completed", "upcoming"],
        type: String,
        default: "ongoing",
    },
    lastLectureId: {
        type: Schema.Types.ObjectId,
        ref: "Lecture"
    },
    learningTime: {
        type: Number,//seconds
        default: 0
    }

}, { timestamps: true });

module.exports = model("CourseProgress", courseProgressSchema);