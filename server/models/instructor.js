const { Schema, model } = require("mongoose");

const instructorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messageForStudents: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    myCourses: {
        type: [Schema.Types.ObjectId],
        ref: "Course"
    },
    profileImg: {
        type: String,
        filename: String
    }
}, { timestamps: true });

module.exports = model("Instructor", instructorSchema);