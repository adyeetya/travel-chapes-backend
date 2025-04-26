import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    noOfPeople: {  // Fix typo: "noOfPepole" → "noOfPeople"
        type: Number,
        required: true
    },
    tripId: {
        type: mongoose.Types.ObjectId,
        ref: 'trip',
        required: true
    },
    agreedPrice: {
        type: Number,
        required: true,
        min: 0
    },
    payments: [{
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        amount: { type: Number, required: true },
        method: { type: String, enum: ["cash", "online"], required: true },
        transactionId: { type: String, default: "" },
        receiver: { type: String, default: "" },
        status: { 
            type: String, 
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },
        date: { type: Date, default: Date.now }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin"
    }
}, { timestamps: true, collection: "booking" });

module.exports = mongoose.model("booking", bookingSchema);