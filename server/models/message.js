const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    discussion: {
        type: Schema.Types.ObjectId,
        ref: "Discussion",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "senderModel",
    },
    senderModel: {
        type: String,
        enum: ["Tutor", "User"],
        required: true,
    },
    isTutor: {
        type: Boolean,
        default: false,
    },
    content: {
        type: String,
        required: true,
    },
    attachements: [
        {
            filename: String,
            url: String,
        }
    ],
    readBy: {
        type: [Schema.Types.ObjectId]
    }
}, { timestamps: true });

module.exports = model("Message", messageSchema);