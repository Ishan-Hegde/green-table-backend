const express = require("express");
const router = express.Router();
const FoodListing = require("../models/FoodListing");
const User = require("../models/User");

router.post("/list-food", async (req, res) => {
  try {
    const { restaurantId, name, description, quantity, location, price } = req.body;
    const restaurant = await User.findById(restaurantId);

    if (!restaurant || !restaurant.isVerified) {
      return res.status(403).json({ error: "Restaurant not verified" });
    }

    const newListing = new FoodListing({
      restaurant: restaurantId,
      name,
      description,
      quantity,
      location,
      price,
    });

    await newListing.save();
    res.status(201).json({ message: "Food listed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Food listing failed" });
  }
});

module.exports = router;
