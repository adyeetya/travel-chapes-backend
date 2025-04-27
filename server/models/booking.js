import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    tripId: {
        type: mongoose.Types.ObjectId,
        ref: 'trip',
    },
    noOfPeople: {
        type: Number,
    },
    price: {
        type: Number,
    },
    isPaymentInitated:{
        type:Boolean,
        default:false
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "failed", "completed"]
    }
}, { timestamps: true, collection: "booking" });

module.exports = mongoose.model("booking", bookingSchema);