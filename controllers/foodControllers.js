const Food = require('../models/Food');
// Remove the socket.io-client import
// const io = require('socket.io-client'); // This is not needed on the server-side

// Add food listing
const addFoodListing = async (req, res) => {
    try {
        const { restaurantId, name, description, price } = req.body;

        const newFood = new Food({
            restaurantId,
            name,
            description,
            price,
        });

        // Save the new food item to the database
        await newFood.save();

        // Emit the new food listing to all connected clients
        io.emit('newFood', newFood); // Broadcasting the new food item

        res.status(201).json(newFood);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all food listings by restaurant ID
const getFoodListings = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const foodListings = await Food.find({ restaurantId });
        res.status(200).json(foodListings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addFoodListing, getFoodListings };
