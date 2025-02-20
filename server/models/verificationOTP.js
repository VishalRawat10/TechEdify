const { model, Schema } = require("mongoose");

const verificationOtpSchema = new Schema({
    OTP: String,
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
    }
}, { timestamps: true });
module.exports = model("verificationOTP", verificationOtpSchema);