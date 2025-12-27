import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  telegramId: Number,
  otp: String,
  expiresAt: Number,
});

const OTP = mongoose.model("OTP", otpSchema); // collection: "otps"

export default OTP;

