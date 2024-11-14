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
const foodController = require('./controllers/foodControllers'); // Import food controller

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io with the server

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/restaurant', restaurantRoutes);

// Food Routes with Socket.io passed to controller
app.post('/api/food', (req, res) => {
    foodController.addFoodListing(req, res, io); // Pass io to the controller
});
app.get('/api/food/:restaurantId', foodController.getFoodListings);

// Real-time socket event
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Green Table API!');
});
