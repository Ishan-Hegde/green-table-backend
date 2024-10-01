const express = require('express');
const { registerConsumer, registerRestaurant, login } = require('../controllers/authControllers');
const router = express.Router();

// Consumer signup
router.post('/consumer/signup', registerConsumer);

// Restaurant signup
router.post('/restaurant/signup', registerRestaurant);

// Login
router.post('/login', login);

module.exports = router;
