const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  telegramId: Number,
  otp: String,
  expiresAt: Number,
});

module.exports = mongoose.model("OTP", otpSchema); // collection: "otps"
