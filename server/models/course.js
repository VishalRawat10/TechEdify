const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: String,
        required: true,
    },
    teacher: {
        type: [Schema.Types.ObjectId],
        ref: "Teacher",
        required: true,
    },
    numberOfLectures: {
        type: Number,
        required: true,
        min: [1, 'A course must have at least one lecture.'],
    },
    content: {
        type: [String],
        required: true,
    },
    detailedContent: {
        type: [[String]],
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        //     },
        //     message: 'Invalid profile picture URL.',
        // },
    },
    about: {
        type: String,
        required: true,
        trim: true,
    },
    alias: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: String,
        required: true,
    },
    desciption: {
        type: String,
        // required: true,
    },
    reviews: {
        type: [Schema.Types.ObjectId],
        ref: "Review"
    }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
