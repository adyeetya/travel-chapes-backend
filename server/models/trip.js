const mongoose = require('mongoose');

const pricingItemSchema = new mongoose.Schema({
    single: { type: Number, required: true },
    double: { type: Number, required: true },
    triple: { type: Number, required: true }
}, { _id: false });

const tripSchema = new mongoose.Schema({
    locationId: { type: mongoose.Types.ObjectId, ref: "location", required: true },
    slug: { type: String, required: true },
    pickup: { type: String, required: true },
    viaPoints: { type: String },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    itinerary: [{ type: String }],
    vehicles: [{ type: mongoose.Types.ObjectId, ref: "vehicle" }],
    stays: [{ type: mongoose.Types.ObjectId, ref: "hotel" }],
    meals: [{ type: String }],
    pricing: {
        type: Map,
        of: pricingItemSchema,
        default: {}
    },
    gst: { type: Number, default: 18 },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, collection: "trip" });

module.exports = mongoose.model("trip", tripSchema);