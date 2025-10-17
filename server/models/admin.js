const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    isTempPassword: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    personalEmail: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    profileImage: {
        url: String,
        filename: String
    }
});

module.exports = model("admin", adminSchema);