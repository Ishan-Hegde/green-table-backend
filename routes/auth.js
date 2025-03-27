const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendOTP = require("../utils/emailService");

const router = express.Router();

// 🔹 Register User (with email & password)
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// 🔹 Send OTP & Store in User DB
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOTP(email, otp);
    res.json({ message: "OTP sent successfully" });
});

// 🔹 Verify OTP & Login
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
        return res.status(400).json({ error: "OTP expired" });
    }

    // OTP Verified ✅ - Remove OTP from the DB
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
});

module.exports = router;
