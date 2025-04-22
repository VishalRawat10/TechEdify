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
    }
});

module.exports = model("Message", messageSchema);