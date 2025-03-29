import mongoose from "mongoose";
const vehicleSchema = new mongoose.Schema({
    name: {
        type: String
    },
    maxPeople: {
        type: Number
    },
    type: {
        type: String
    },
    contact: {
        type: String
    }
}, { timestamps: true, collection: "vehicle" })

module.exports = mongoose.model("vehicle", vehicleSchema)