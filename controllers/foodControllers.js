// controllers/foodControllers.js
const FoodListing = require('../models/Food'); // Correct model import

// Add food listing
const addFoodListing = async (req, res) => {
    try {
        const { restaurantId, restaurantName, foodItems, description, price, quantity, category, expiryDate } = req.body;

        const newFoodListing = new FoodListing({
            restaurantId,
            restaurantName,
            foodItems,
            description,
            price,
            quantity,
            category,
            expiryDate,
        });

        await newFoodListing.save();
        
        // Emit to all connected consumers when new food is added
        req.io.emit('newFoodAvailable', newFoodListing);

        res.status(201).json(newFoodListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get all food listings by restaurant ID
const getFoodListings = async (req, res) => {
    const { restaurantId } = req.params;

  try {
    // Fetch food items that belong to the specific restaurant using the restaurantId
    const foodItems = await Food.find({ restaurantId });

    if (!foodItems.length) {
      return res.status(404).json({ message: 'No food items found for this restaurant' });
    }

    // Send the food items back as JSON
    res.status(200).json(foodItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch food items for this restaurant' });
  }
};

module.exports = { addFoodListing, getFoodListings };
