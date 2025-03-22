const express = require("express");
const Order = require("../models/Order");
const io = require("../server"); // Import WebSocket server

const router = express.Router();

// Update Order Status & Emit Event
router.put("/update-status/:orderId", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Emit event to WebSocket clients
        io.to(order._id.toString()).emit("orderUpdated", order);

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
