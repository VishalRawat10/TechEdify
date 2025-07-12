const { Schema, model } = require("mongoose");

const tutorSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    personalEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    phone: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    myCourses: {
        type: [Schema.Types.ObjectId],
        ref: "Course"
    },
    profileImage: {
        url: String,
        filename: String,
    },
    isSuspended: {
        type: Boolean,
        default: false,
        required: true
    }
}, { timestamps: true });

module.exports = model("Tutor", tutorSchema);