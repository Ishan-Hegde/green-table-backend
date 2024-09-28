const mongoose = require('mongoose');
const ListingSchema = new mongoose.Schema({
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['available', 'picked'], default: 'available' },
    listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    listedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Listing', ListingSchema);
