const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailPassword: { type: String, required: true }, // This will be encrypted
    otp: { type: String },
    otpExpires: { type: Date }
});

// Hash emailPassword before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('emailPassword')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.emailPassword = await bcrypt.hash(this.emailPassword, salt);
    
    next();
});

module.exports = mongoose.model('User', userSchema);
