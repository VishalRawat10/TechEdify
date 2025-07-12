const { Schema, model } = require("mongoose");

const lectureSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    lectureVideo: {
        filename: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        url: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            required: true
        }
    },
    notes: {
        url: {
            type: String,
        },
        filename: {
            type: String,
        }
    },
    assignment: {
        url: {
            type: String,
        },
        filename: {
            type: String,
        }
    },
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
    },
    status: {
        type: String,
        enum: ["published", "unpublished"],
        default: "published",
        required: true
    }
}, { timestamps: true });

module.exports = model("Lecture", lectureSchema);