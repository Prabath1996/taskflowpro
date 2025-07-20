const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Regiter User
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Check if username was entered
    if (!username) {
      return res.status(400).json({
        error: "Name is Required",
      });
    }
    //Check if email was entered
    if (!email) {
      return res.status(400).json({ error: "Email is Required" });
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    //Password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password || !strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
      });
    }
    //Check Email
    const exist = await User.findOne({ email });
    //Check if username was entered
    if (exist) {
      return res.status(409).json({
        error: "Email is taken already",
      });
    }

    //Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create User
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login with JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is Required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is Required" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({
        success: true,
        token: token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      return res.status(401).json({ error: "Password does not match" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset password route
router.post("/reset-password", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.userId; // from JWT

    // Check if new password was entered
    if (!newPassword) {
      return res.status(400).json({
        error: "New Password is Required",
      });
    }

    // Password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
      });
    }
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    // Update user password
    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
