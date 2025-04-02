import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Types.ObjectId,
        ref: 'trip'
    },
    name: {
        type: String
    },
    contact: {
        type: String
    },
    agreedPrice: {
        type: Number
    },
    numOfPeople: {
        type: Number
    },
    payments: [{
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        amount: { type: Number, required: true },
        method: { type: String, enum: ["cash", "card", "online"], required: true },
        transactionId: { type: String, default: "" },
        receiver: { type: String, required: true },
        date: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true, collection: "customer" })

module.exports = mongoose.model("customer", customerSchema);