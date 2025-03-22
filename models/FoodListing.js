const mongoose = require("mongoose");

const FoodListingSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true },
  location: { type: String, required: true }, // Added location field
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FoodListing", FoodListingSchema);
