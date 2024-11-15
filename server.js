// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const addressRoutes = require('./routes/address');
const restaurantRoutes = require('./routes/restaurant');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const consumerRoutes = require('./routes/consumer');



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet()); // Security middleware
app.use(express.json());

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Pass io to routes that need it
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes); // foodRoutes will receive req.io
app.use('/api/address', addressRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/consumer', consumerRoutes); // Add this line for consumer routes


// Real-time socket event
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Green Table API!');
});
