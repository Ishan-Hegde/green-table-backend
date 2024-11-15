// controllers/foodControllers.js

const FoodListing = require('../models/Food'); // Correct model import

// Add food listing
const addFoodListing = async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const { 
      restaurantId, 
      restaurantName, 
      foodItems, 
      description, 
      price, 
      quantity, 
      category, 
      expiryDate, 
      timeOfCooking 
    } = req.body;

    const newFoodListing = new FoodListing({
      restaurantId,
      restaurantName,
      foodItems,
      description,
      price,
      quantity,
      category,
      expiryDate,
      timeOfCooking,
    });

    const savedListing = await newFoodListing.save();

    console.log('Saved Listing:', savedListing);

    req.io.emit('newFoodAvailable', savedListing);

    res.status(201).json(savedListing);
  } catch (err) {
    console.error('Error in Add Food Listing:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all food listings by restaurant ID
const getFoodListings = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const foodItems = await FoodListing.find({ restaurantId });

    if (!foodItems.length) {
      return res.status(404).json({ message: 'No food items found for this restaurant' });
    }

    res.status(200).json(foodItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch food items for this restaurant' });
  }
};

module.exports = { addFoodListing, getFoodListings };
