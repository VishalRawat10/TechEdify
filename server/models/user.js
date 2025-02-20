const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [2, "Firstname should contain 2 more alphabates."]
        },
        lastname: {
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    coursesEnrolled: {
        type: [Schema.Types.ObjectId],
        ref: "course",
    },
    profileImg: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    address: String,
    country: String,
    mobile: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    verificationOTP: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);