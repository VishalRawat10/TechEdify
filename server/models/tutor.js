const { Schema, model } = require("mongoose");
const Course = require("./course");
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
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    isTempPassword: {
        type: Boolean,
        default: true,
    },
    contact: {
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
    }
}, { timestamps: true });

tutorSchema.post("findOneAndDelete", async (tutor, next) => {
    if (tutor) {
        tutor.myCourses.forEach(async (id) => {
            const course = await Course.findByIdAndUpdate(id, {
                tutorDetails: {
                    _id: tutor._id,
                    fullname: tutor.fullname,
                    profileImage: tutor.profileImage
                }
            });
        });
    }
    next();

})

module.exports = model("Tutor", tutorSchema);