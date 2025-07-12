const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("../models/review");
const Course = require("../models/course");

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        min: 2
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    enrolledCourses: {
        type: [Schema.Types.ObjectId],
        ref: "Course",
    },
    profileImage: {
        url: String,
        filename: String,
    },
    DOB: {
        type: Date,
    },
    address: String,
    country: String,
    phone: String,
    about: String,
    isSuspended: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    currLoginTime: {
        type: Date,
    },
    currToken: {
        type: String,
    },
    currDevice: {
        type: String,
    }
}, { timestamps: true });

userSchema.post("findOneAndDelete", async (user) => {
    const reviews = await Review.find({ author: user._id });
    reviews.forEach(async (review, idx) => {
        const course = await Course.findById(review.courseId);
        course.reviews.splice(idx, 1);
        await course.save();
    });
    console.log(user);
    user.coursesEnrolled.forEach(async (courseId, idx) => {
        const course = await Course.findById(courseId);
        course.enrolledStudents.splice(idx, 1);
        await course.save();
    });
    await Review.deleteMany({ author: user._id });
})

module.exports = mongoose.model("User", userSchema);