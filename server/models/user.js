const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        min: 2
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    enrolledCourses: {
        type: [Schema.Types.ObjectId],
        ref: "Course",
    },
    profileImage: {
        url: String,
        filename: String,
    },
    DOB: {
        type: Date,
    },
    address: String,
    country: String,
    contact: String,
    about: String,
    isSuspended: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    currLoginTime: {
        type: Date,
    },
    currToken: {
        type: String,
    },
    currDevice: {
        type: String,
    },
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);