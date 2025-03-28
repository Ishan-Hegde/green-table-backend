// const express = require('express');
// const { registerConsumer, registerRestaurant, login } = require('../controllers/authController');

// const router = express.Router();

// router.post('/register/consumer', registerConsumer);
// router.post('/register/restaurant', registerRestaurant);
// router.post('/login', login);

// module.exports = router;
const express = require('express');
const { loginOrRegisterConsumer, verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginOrRegisterConsumer);
router.post('/verify-otp', verifyOTP);

module.exports = router;
