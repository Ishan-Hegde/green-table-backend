const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isAdmin, authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// User Registration (For Customers & Restaurants)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer", // Default role is customer
      isVerified: role === "restaurant" ? false : true, // Restaurants need verification
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Check if restaurant is verified before login
    if (user.role === "restaurant" && !user.isVerified) {
      return res.status(403).json({ error: "Restaurant not verified by admin" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Admin Route to Verify Restaurants
router.put("/verify/:userId", authenticateUser, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || user.role !== "restaurant") {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    user.isVerified = true;
    await user.save();
    res.json({ message: "Restaurant verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Fetch User Details (Protected Route)
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

module.exports = router;
