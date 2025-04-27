import mongoose, { Mongoose } from "mongoose";
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tripId:{
        type: mongoose.Types.ObjectId,
        ref:"trip"
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref: 'booking'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin"
    }
}, { timestamps: true, collection: "customer" });

module.exports = mongoose.model("customer", customerSchema);