const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const listingController = require('../controllers/listingController');

router.post('/create', auth, listingController.createListing);
router.get('/available', listingController.getListings);

module.exports = router;
