// routes/food.js
const express = require('express');
const { addFoodListing, getFoodListings } = require('../controllers/foodControllers');
const router = express.Router();

// Fetch all food listings
router.get('/', async (req, res) => {
    try {
      // Fetch all food items from the database
      const foodItems = await Food.find();
  
      // Send the food items back as JSON
      res.status(200).json(foodItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch food items' });
    }
  });

// POST route to add food listing
router.post('/addFood', addFoodListing);

// GET route to get food listings by restaurantId
router.get('/:restaurantId', getFoodListings);

module.exports = router;
