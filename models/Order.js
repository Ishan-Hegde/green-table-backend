const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    item: String,
    quantity: Number,
    status: String
});

module.exports = mongoose.model('Order', orderSchema);
