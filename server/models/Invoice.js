// models/Invoice.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        invoiceDate: {
            type: Date,
            required: true,
        },
        agreedPrice: {
            type: Number,
            required: true,
        },
        tripName: {
            type: String,
            required: true,
        },
        packageSelected: {
            type: String,
            required: true,
        },
        customerAddress: {
            type: String,
            required: true,
        },
        cgst: {
            type: Number,
            required: true,
        },
        sgst: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
        },
        transactionId: {
            type: String,
        },
        gstin: {
            type: String,
        },
        notes: {
            type: String,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin", // assuming you have a user model
        },
    },
    { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
