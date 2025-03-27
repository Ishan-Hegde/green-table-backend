const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    kycStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    kycDocuments: { type: [String] }, // Store file paths or URLs
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
