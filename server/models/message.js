const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    }
});

module.exports = model("Message", messageSchema);