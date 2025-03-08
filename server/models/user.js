import mongoose from 'mongoose';
import userType from '../enums/userType';
import status from '../enums/status';
const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      mobileNumber: { type: String, required: true, unique: true },
      isMobileVerified: { type: Boolean, default: false },
      isEmailVerified: { type: Boolean, default: false },
      status: { type: String, default: status.active, enum: [status.active, status.delete, status.block] },
      otp: { type: String },
      otpExpiresAt: { type: Date },
   },
   { timestamps: true, collection: 'user' }
);

module.exports = mongoose.model('user', userSchema);


