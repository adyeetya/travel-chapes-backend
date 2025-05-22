import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
    text: {
        type: String
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }

}, { timestamps: true, collection: "blog" });

module.exports = mongoose.model("blog", blogSchema);