const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, OTP_EXPIRY } = require('../config/config');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
};

// Register a Consumer with OTP verification
exports.registerConsumer = async (req, res) => {
    try {
        const { name, email, password, phone, otp } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const validOtp = await OTP.findOne({ phone, otp });

        if (!validOtp || validOtp.expiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, phone, password: hashedPassword, role: 'consumer', isVerified: true });

        await OTP.deleteOne({ phone }); // Remove OTP after verification
        res.status(201).json({ token: generateToken(user), user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Register a Restaurant (without OTP but requiring KYC)
exports.registerRestaurant = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, phone, password: hashedPassword, role: 'restaurant' });

        res.status(201).json({ token: generateToken(user), user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering restaurant', error });
    }
};

// Login (For Both Consumers & Restaurants)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({ token: generateToken(user), user });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};
