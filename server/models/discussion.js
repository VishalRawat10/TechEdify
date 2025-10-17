const { Schema, model } = require("mongoose");

const discussionSchema = new Schema({
    // All participants (could be tutor or students)
    members: [
        {
            member: {
                type: Schema.Types.ObjectId,
                required: true,
                refPath: "members.memberModel",
            },
            memberModel: {
                type: String,
                enum: ["Tutor", "User"],
                required: true,
            },
        },
    ],

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },

    // For course-level discussions
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },

    type: {
        type: String,
        enum: ["course", "private"],
        required: true,
    }
}, { timestamps: true });

module.exports = model("Discussion", discussionSchema);