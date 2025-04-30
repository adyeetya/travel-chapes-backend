import mongoose from 'mongoose';
import userType from '../enums/userType';
import status from '../enums/status';
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    adminType: { type: String, default: userType.admin, enum: [userType.subAdmin, userType.admin,userType.CONTENT,userType.SALES] },
    status: { type: String, default: status.active, enum: [status.active, status.delete, status.block] },
    otp: { type: String },
    otpTime: { type: Date },
},
    { timestamps: true, collection: 'Admin' }
);

const admin = mongoose.model('Admin', adminSchema);

async function defaultAdmin() {
    try {
        const adminResult = await admin.findOne({ adminType: userType.admin, status: status.active });
        if (adminResult) {
            console.log("Default admin already created!💪")
            return;
        }
        await admin.create({
            email:"2612adityasingh2000@gmail.com",
            mobileNumber:"8400372110",
            hashedPassword:"$2b$10$iDyJH/ogzpqwLjSVMUzclu8K/.k9DBvxY3Ad4BOMUlArjGCIBDwiG"
        })
        console.log("New Default admin created!💪")

    } catch (error) {
        console.log(error)
    }
}
defaultAdmin();

module.exports = admin