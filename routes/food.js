const express = require('express');
const { addFoodListing, getFoodListings } = require('../controllers/foodControllers'); // Ensure both are imported
const router = express.Router();

// Add food listing
router.post('/', addFoodListing);
// Get food listings by restaurantId
router.get('/:restaurantId', getFoodListings);  // Ensure this line uses the correct function

module.exports = router;
