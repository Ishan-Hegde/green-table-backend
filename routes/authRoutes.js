const express = require('express');
const { registerConsumer, registerRestaurant, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register/consumer', registerConsumer);
router.post('/register/restaurant', registerRestaurant);
router.post('/login', login);

module.exports = router;
