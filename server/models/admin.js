import mongoose from 'mongoose';
import userType from '../enums/userType';
import status from '../enums/status';
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    adminType: { type: String, default: userType.admin, enum: [userType.subAdmin, userType.admin] },
    status: { type: String, default: status.active, enum: [status.active, status.delete, status.block] },
    otp: { type: String },
    otpTime: { type: Date },
},
    { timestamps: true, collection: 'Admin' }
);

const admin = mongoose.model('admin', adminSchema);
async function defaultAdmin() {
    try {
        const adminResult = await admin.findOne({ adminType: userType.admin, status: status.active });
        if (adminResult) {
            console.log("Default admin already created!💪")
            return;
        }
        await admin.create({
            email:"shvam12@yopmail.com",
            hashedPassword:"$2b$10$2.6OU/AkKiHlwlUtN6z7Fu.ArMA6x5IaoW/76uhseNsMVjUbUc0zG"
        })

    } catch (error) {
        console.log(error)
    }
}
defaultAdmin();

module.exports = admin