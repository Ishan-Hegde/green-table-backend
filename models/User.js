const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
    otp: { type: String, default: null }, // Store OTP temporarily
    otpExpiresAt: { type: Date, default: null } // Expiry time for OTP
});

module.exports = mongoose.model("User", UserSchema);
