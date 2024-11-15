// controllers/foodControllers.js
const FoodListing = require('../models/Food'); // Correct model import

// Add food listing
const addFoodListing = async (req, res) => {
    try {
        const { restaurantId, restaurantName, foodItems, description, price, quantity, expiryDate, timeOfCooking } = req.body;

        const newFoodListing = new FoodListing({
            restaurantId,
            restaurantName,
            foodItems,
            description,
            price,
            quantity,
            expiryDate,      // Ensure expiryDate is handled properly
            timeOfCooking,   // New field for cooking time
        });

        // Save the new food item to the database
        await newFoodListing.save();

        // Emit the new food listing to all connected clients
        req.io.emit('newFoodAvailable', newFoodListing); // Broadcasting to all clients

        res.status(201).json(newFoodListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all food listings by restaurant ID
const getFoodListings = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const foodListings = await FoodListing.find({ restaurantId });
        res.status(200).json(foodListings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addFoodListing, getFoodListings };
