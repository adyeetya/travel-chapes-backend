import mongoose from "mongoose";

const tripForm = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    destination:{
        type: String
    },
    phoneNumber: {
        type: String
    },
    numberOfDays: {
        type: Number
    },
    numberOfTravelers: {
        type: Number
    }
}, { timestamps: true, collection: "tripForm" });

module.exports = mongoose.model("tripForm", tripForm)