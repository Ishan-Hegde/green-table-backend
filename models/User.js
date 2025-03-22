const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["consumer", "restaurant"], required: true },
  isVerified: { type: Boolean, default: false }, // Verification Status
  verificationDocs: { type: String }, // File URL (KYC, License, etc.)
});

module.exports = mongoose.model("User", UserSchema);
