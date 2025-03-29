import mongoose from "mongoose";
const locationSchema = new mongoose.Schema({
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true, collection: "location" });

module.exports = mongoose.model("location",locationSchema)