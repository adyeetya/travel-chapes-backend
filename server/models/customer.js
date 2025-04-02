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
        
    }]
}, { timestamps: true, collection: "customer" })

module.exports = mongoose.model("customer",customerSchema);