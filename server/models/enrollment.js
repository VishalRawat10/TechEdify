const { Schema, model } = require("mongoose");

const enrollmentSchema = new Schema({
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: true,

    },
    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseDetails: {
        _id: Schema.Types.ObjectId,
        title: String,
        thumbnail: {
            url: String,
            filename: String
        }
    },
    userDetails: {
        _id: Schema.Types.ObjectId,
        fullname: String,
        profileImage: {
            url: String,
            filename: String
        }
    }
}, { timestamps: true });

module.exports = model("Enrollment", enrollmentSchema);