import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    razorpay_payment_id: {
        type: String,
        unique: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['captured', 'failed', 'authorized', 'refunded'],
        required: true
    },
    razorpay_transaction_id: {
        type: String,
        unique: true
    },
    amount_paid: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    payment_method: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking',
        required: true
    },
    payment_date: {
        type: Date,
        default: Date.now
    },
    razorpay_response: {
        type: Object,
        required: false
    },
    refund_status: {
        type: String,
        enum: ['pending', 'refunded', 'failed'],
        default: 'pending'
    },
    refund_amount: {
        type: Number,
        default: 0
    },
    refund_date: {
        type: Date
    }
}, { timestamps: true, collection: "payment" });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
