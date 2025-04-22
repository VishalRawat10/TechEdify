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
        filename: String,
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
        type: String,
        required: true
    },
    notes: {
        type: [String]
    },
    assignment: {
        type: [String]
    },
    instructorId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });

module.exports = model("Lecture", lectureSchema);