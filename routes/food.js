// routes/food.js

const express = require('express');
const { addFoodListing, getFoodListings } = require('../controllers/foodControllers');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Middleware for input validation
const validateFoodListing = [
  check('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
  check('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  check('price').isNumeric().withMessage('Price must be a number'),
  check('quantity').isNumeric().withMessage('Quantity must be a number'),
  check('category').notEmpty().withMessage('Category is required'),
  check('timeOfCooking').notEmpty().withMessage('Time of cooking is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Fetch all food listings
router.get('/all', async (req, res) => {
  try {
    const foodItems = await FoodListing.find();

    if (!foodItems.length) {
      console.log('No food items found in the database');
      return res.status(404).json({ message: 'No food items available' });
    }

    res.status(200).json(foodItems);
  } catch (error) {
    console.error('Error fetching food items:', error.message);
    res.status(500).json({ message: 'Failed to fetch food items' });
  }
});



// POST route to add food listing
router.post('/addFood', validateFoodListing, addFoodListing);

// GET route to get food listings by restaurantId
router.get('/:restaurantId', getFoodListings);

module.exports = router;
