import mongoose from "mongoose";
const userQuery = new mongoose.Schema({
    email: {
        type: String,
    },
    name: {
        type: String
    },
    destination: {
        type: String
    },
    phone: {
        type: String
    },
    travelers: {
        type: String
    },
    query: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'in_progress', 'converted', 'closed', 'spam'],
        default: 'pending'
    },
    createdFrom: {
        type: String,

        default: 'website'
    },
}, { timestamps: true, collection: "userQuery" });

module.exports = mongoose.model("userQuery", userQuery);