import mongoose from 'mongoose';
import userType from '../enums/userType';
import status from '../enums/status';
const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      mobileNumber: { type: String, required: true, unique: true },
      isMobileVerified: { type: Boolean, default: false },
      isEmailVerified: { type: Boolean, default: false },
      userStatus: { type: String, default: userType.user, enum: [userType.user, userType.admin] },
      status: { type: String, default: status.active, enum: [status.active, status.delete, status.block] },
      otp: { type: String },
      otpTime: { type: Date },
   },
   { timestamps: true, collection: 'user' }
);

module.exports = mongoose.model('user', userSchema);


