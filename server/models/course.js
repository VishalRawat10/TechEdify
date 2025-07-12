const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("../models/user");
const Tutor = require("./tutor");


const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    tutor: {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
        required: true,
    },
    numberOfLectures: {
        type: Number,
        required: function () {
            return this.courseStatus === "completed";
        },
        min: [1, 'A course must have at least one lecture.'],
    },
    profileImage: {
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
    desciption: {
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
        ref: "Lecture"
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
            }
        }
    ],
    enrolledStudents: {
        type: [Schema.Types.ObjectId],
        ref: "User"
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
