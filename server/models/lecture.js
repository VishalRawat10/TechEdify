const { Schema, model } = require("mongoose");

const lectureSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    lectureVideo: {
        url: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            required: true
        }
    },
    description: {
        type: String,
        required: true,
        trim: true
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
    tutor: {
        type: Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
    },
}, { timestamps: true });

module.exports = model("Lecture", lectureSchema);