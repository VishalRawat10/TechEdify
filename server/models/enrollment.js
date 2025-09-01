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
}, { timestamps: true });

module.exports = model("Enrollment", enrollmentSchema);