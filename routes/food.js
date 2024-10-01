const express = require('express');
const { addFoodListing } = require('../controllers/foodControllers');
const router = express.Router();

// Add food listing
router.post('/', addFoodListing);

module.exports = router;
