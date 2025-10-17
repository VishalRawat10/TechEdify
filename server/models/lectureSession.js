const { model, Schema } = require("mongoose");

const lectureSessionSchema = new Schema({
    lecture: {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    watchTime: {
        type: Number,
        default: 0, //in seconds
        required: true,
    },
    lastTimeStamp: {
        type: Number,
        default: 0,
        required: true,
    }
});
module.exports = model("lectureSession", lectureSessionSchema);
