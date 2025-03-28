// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     name: String,
//     email: { type: String, unique: true, required: true },
//     phone: { type: String, unique: true, required: true },
//     password: String,
//     role: { type: String, enum: ['consumer', 'restaurant'], required: true },
//     isVerified: { type: Boolean, default: false },
//     kycCompleted: { type: Boolean, default: false }
// });

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },  // Stores OTP for verification
    verified: { type: Boolean, default: false },  // Checks if user is verified
});

module.exports = mongoose.model('User', UserSchema);
