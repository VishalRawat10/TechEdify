const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("../models/user");
const Tutor = require("./tutor");


const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        trim: true
    },
    tutor: {
        type: Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
    },
    thumbnail: {
        url: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            required: true,
        }
    },
    alias: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    reviews: {
        type: [Schema.Types.ObjectId],
        ref: "Review"
    },
    lectures: {
        type: [Schema.Types.ObjectId],
        ref: "Lecture",
        select: false,
    },
    publishStatus: {
        enum: ["published", "unpublished"],
        default: "unpublished",
        type: String
    },
    courseStatus: {
        enum: ["ongoing", "completed", "upcoming"],
        default: "upcoming",
        type: String
    },
    chapters: [
        {
            name: {
                type: String,
                // required: true,
                trim: true
            },
            content: {
                type: String,
                // required: true
                trim: true
            }
        }
    ],
    enrolledStudents: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        select: false,
    },
    type: {
        type: String,
        enum: ["Development", "DSA", "Language"],
        required: true,
    }
}, { timestamps: true });

courseSchema.post("findOneAndDelete", async (course) => {
    course.enrolledStudents?.forEach(async (studentId) => {
        const student = await User.findById(studentId);
        student.coursesEnrolled.splice(student.coursesEnrolled.indexOf(course._id), 1);
        await student.save();
    });
    const instructor = await Instructor.findById(course.instructor);
    instructor.myCourses.splice(instructor.myCourses.indexOf(course._id), 1);
});

module.exports = mongoose.model("Course", courseSchema);
