const Consumer = require('../models/Consumer');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register consumer
const registerConsumer = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newConsumer = new Consumer({ name, email, password: hashedPassword });
        await newConsumer.save();
        res.status(201).json({ message: 'Consumer registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Register restaurant
const registerRestaurant = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newRestaurant = new Restaurant({ name, email, password: hashedPassword });
        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check in both collections
        const user = await Consumer.findOne({ email }) || await Restaurant.findOne({ email });
        
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerConsumer, registerRestaurant, login };
