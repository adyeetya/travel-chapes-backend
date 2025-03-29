import mongoose from "mongoose";
const userQuery = new mongoose.Schema({
    email: {
        type: String,
    },
    name: {
        type: String
    },
    query: {
        type: String
    }
}, { timestamps: true, collection: "userQuery" });

module.exports = mongoose.model("userQuery", userQuery);