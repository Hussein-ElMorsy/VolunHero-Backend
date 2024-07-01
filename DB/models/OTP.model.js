import mongoose, { Schema, Types, model } from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User"
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time 
  },
});

const otpModel = mongoose.models.OTP || model("OTP", otpSchema);
export default otpModel;