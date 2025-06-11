const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("../models/review");
const Course = require("../models/course");

const userSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [2, "Firstname should contain 2 more alphabates."]
        },
        lastname: {
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: () => !this.tempPassword,
    },
    coursesEnrolled: {
        type: [Schema.Types.ObjectId],
        ref: "Course",
        select: function () {
            return this.role === "student";
        }
    },
    profileImg: {
        url: String,
        filename: String,
    },
    DOB: {
        type: String,
    },
    address: String,
    country: String,
    phone: String,
    about: String,
    role: {
        enum: ["student", "instructor", "admin"],
        type: String,
        default: "student",
    },
    isTempPassword: {
        type: Boolean,
        default: function () {
            return this.role === "instructor";
        },
        select: function () {
            return this.role === "instructor"
        }
    },
    instructorId: {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
        required: function () {
            return this.role === "instructor";
        },
        select: function () {
            return this.role === "instructor"
        }
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    currLoggedInTime: {
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