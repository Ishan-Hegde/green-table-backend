const express = require('express');
const { addFoodListing } = require('../controllers/foodControllers');
const router = express.Router();

// Add food listing
router.post('/', addFoodListing);
// Get food listings by restaurantId
router.get('/:restaurantId', getFoodListings);


module.exports = router;
