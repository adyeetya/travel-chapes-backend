import mongoose, { Mongoose } from "mongoose";
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                // Basic international phone number validation
                // Allows optional + prefix, numbers, and some special characters
                return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref: 'booking'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin"
    }
}, { timestamps: true, collection: "customer" });

module.exports = mongoose.model("customer", customerSchema);