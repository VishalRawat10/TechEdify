const { Schema, model } = require("mongoose");

const queryMessageSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    queryMessage: {
        type: String,
        required: true,
    },
    isResolved: {
        type: Boolean,
        default: false,
    }
}, { timeseries: true });

module.exports = model("QueryMessage", queryMessageSchema);
