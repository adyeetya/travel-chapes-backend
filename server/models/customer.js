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
        method: { type: String, enum: ["cash", "online"], required: true },
        transactionId: { type: String, default: "" },
        receiver: { type: String, default: "" },


    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, collection: "customer" })

module.exports = mongoose.model("customer", customerSchema);