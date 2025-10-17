const mongoose = require("mongoose");
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
        select: false,
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
        select: false,
    },
    type: {
        type: String,
        enum: ["Development", "DSA", "Language"],
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
