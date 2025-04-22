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
        url: String,
        filename: String,
    },
    DOB: {
        type: String,
    },
    address: String,
    country: String,
    phone: String,
    about: String,
    role: {
        enum: ["student", "instructor", "admin"],
        type: String,
        default: "student",
    },
    instructorId: {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
        required: function () {
            return this.role === "instructor";
        }

    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);