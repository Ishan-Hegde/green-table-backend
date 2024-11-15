// models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    restaurantName: { type: String, required: true },
    foodItems: String,
    description: String,
    expiryDate: Date,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },  // Add category field
    timeOfCooking: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('FoodListing', foodSchema);
