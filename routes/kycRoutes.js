const express = require('express');
const { submitKYC, approveKYC } = require('../controllers/kycController');

const router = express.Router();

router.post('/submit', submitKYC);
router.put('/approve', approveKYC);

module.exports = router;
