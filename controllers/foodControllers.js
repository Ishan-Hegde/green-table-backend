const Food = require('../models/Food');

// Add food listing
const addFoodListing = async (req, res) => {
    try {
        const { restaurantId, name, description, price } = req.body;
        const newFood = new Food({ restaurantId, name, description, price });
        await newFood.save();
        res.status(201).json({ message: 'Food listing added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addFoodListing };
