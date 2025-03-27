const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: String,
    role: { type: String, enum: ['consumer', 'restaurant'], required: true },
    isVerified: { type: Boolean, default: false },
    kycCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
