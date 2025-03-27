const express = require('express');
const authRoutes = require('./authRoutes');
const kycRoutes = require('./kycRoutes');
const foodRoutes = require('./foodRoutes');
const locationRoutes = require('./locationRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/kyc', kycRoutes);
router.use('/food', foodRoutes);
router.use('/location', locationRoutes);

module.exports = router;
