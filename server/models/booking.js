import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    noOfPepole: {
        type: Number
    },
    tripId: {
        type: mongoose.Types.ObjectId,
        ref: 'trip'
    },
    paidAmount: {
        type: Number
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    }
}, { timestamps: true, collection: "booking" });

module.exports = mongoose.model("booking", bookingSchema);