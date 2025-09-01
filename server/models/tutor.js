const { Schema, model } = require("mongoose");

const tutorSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    personalEmail: {
        type: String,
        required: true,
        select: false,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    isTempPassword: {
        type: Boolean,
        default: true,
        select: false,
    },
    phone: {
        type: String,
        select: false,

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
        required: true,
        select: false,
    }
}, { timestamps: true });

module.exports = model("Tutor", tutorSchema);