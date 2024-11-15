// routes/food.js
const express = require('express');
const { addFoodListing, getFoodListings } = require('../controllers/foodControllers');
const router = express.Router();

// POST route to add food listing
router.post('/addFood', addFoodListing);

// GET route to get food listings by restaurantId
router.get('/:restaurantId', getFoodListings);

module.exports = router;
