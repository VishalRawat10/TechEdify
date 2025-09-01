const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
    transactionId: {
        type: String,
        required: () => {
            return this.status === "success";
        }
    },
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    courseId: {
        type: String,
        ref: 'Course',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = model("Payment", paymentSchema);