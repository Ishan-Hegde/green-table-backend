// const User = require('../models/User');
// const OTP = require('../models/OTP');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const { JWT_SECRET, OTP_EXPIRY } = require('../config/config');

// // Generate JWT Token
// const generateToken = (user) => {
//     return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
// };

// // Register a Consumer with OTP verification
// exports.registerConsumer = async (req, res) => {
//     try {
//         const { name, email, password, phone, otp } = req.body;
//         const existingUser = await User.findOne({ email });

//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         const validOtp = await OTP.findOne({ phone, otp });

//         if (!validOtp || validOtp.expiry < Date.now()) {
//             return res.status(400).json({ message: 'Invalid or expired OTP' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ name, email, phone, password: hashedPassword, role: 'consumer', isVerified: true });

//         await OTP.deleteOne({ phone }); // Remove OTP after verification
//         res.status(201).json({ token: generateToken(user), user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering user', error });
//     }
// };

// // Register a Restaurant (without OTP but requiring KYC)
// exports.registerRestaurant = async (req, res) => {
//     try {
//         const { name, email, password, phone } = req.body;
//         const existingUser = await User.findOne({ email });

//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ name, email, phone, password: hashedPassword, role: 'restaurant' });

//         res.status(201).json({ token: generateToken(user), user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering restaurant', error });
//     }
// };

// // Login (For Both Consumers & Restaurants)
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         res.json({ token: generateToken(user), user });
//     } catch (error) {
//         res.status(500).json({ message: 'Login failed', error });
//     }
// };

const User = require('../models/User');
const sendOTP = require('../utils/mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register/Login Function
const loginOrRegisterConsumer = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // New user → Register with OTP verification
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            user = new User({ email, password: hashedPassword, otp, verified: false });
            await user.save();
            
            await sendOTP(email, otp);  // Send OTP via email

            return res.json({ message: "New user detected. OTP sent for verification." });
        }

        if (!user.verified) {
            // Unverified user → Resend OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            await user.save();
            
            await sendOTP(email, otp);

            return res.json({ message: "Unverified user. OTP resent for verification." });
        }

        // Existing user → Direct login
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in login/register:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// OTP Verification
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

        user.verified = true;
        user.otp = null;
        await user.save();

        return res.json({ message: "OTP verified. User registered successfully!" });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { loginOrRegisterConsumer, verifyOTP };
