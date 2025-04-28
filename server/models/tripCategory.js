import mongoose from "mongoose";

const tripCategorySchema = new mongoose.Schema({
    category: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, collection: "tripCategory" });
const tripCategory = mongoose.model("tripCategory", tripCategorySchema);
module.exports = tripCategory;