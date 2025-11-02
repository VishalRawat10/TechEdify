const mongoose = require("mongoose");
const Lecture = require("./lecture.js");
const User = require("./user.js");
const Enrollment = require("./enrollment.js");
const { Schema } = mongoose;


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
    lectures: {
        type: [Schema.Types.ObjectId],
        ref: "Lecture",
    },
    isPublished: {
        type: Boolean,
        default: false,
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
    },
    tutorDetails: {
        _id: Schema.Types.ObjectId,
        fullname: {
            type: String,
        },
        profileImage: {
            url: String,
            filename: String,
        }

    }
}, { timestamps: true });

courseSchema.post("findOneAndDelete", async (course, next) => {
    if (course) {
        const enrollments = await Enrollment.find({ course: course._id });
        enrollments.forEach(async (e) => {
            await Enrollment.findByIdAndUpdate(e._id, {
                courseDetails: {
                    _id: course._id,
                    title: course.title,
                    thumbnail: course.thumbnail
                }
            });
        });
        course.lectures.forEach(async (id) => {
            await Lecture.findByIdAndDelete(id);
        });

        course.enrolledStudents.forEach(async (id) => {
            await User.findByIdAndUpdate(id, { $pull: { enrolledCourses: course._id } });
        });
    }
    next();
});

module.exports = mongoose.model("Course", courseSchema);
