// models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    restaurantName: { type: String, required: true },
    foodItems: [String],
    description: String,
    expiryDate: Date,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },  // Add category field
});

const FoodListing = mongoose.model('FoodListing', foodSchema);

module.exports = FoodListing;
