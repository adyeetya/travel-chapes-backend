const mongoose = require('mongoose');
const tripSchema = new mongoose.Schema({
    locationId: { type: mongoose.Types.ObjectId, ref: "location" ,required: true },
    pickup: { type: String, required: true },
    viaPoints: [{ type: String }],
    drop: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    itinerary: [{ type: String }],
    vehicles: [{ type: String }],
    stays: [{ type: String }],
    meals: [{ type: String }],
    pricing: {
        car: { price: Number },
        bus: { price: Number },
        gst: { type: Number, default: 18 }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, collection: "trip" });

module.exports = mongoose.model("trip", tripSchema)