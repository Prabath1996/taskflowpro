const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

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
      return res.json({
        error: "Name is Required",
      });
    }
    //Check if email was entered
    if (!email) {
      return res.json({
        error: "Email is Required",
      });
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        error: "Invalid email format",
      });
    }
    //Password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password || !strongPasswordRegex.test(password)) {
      return res.json({
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
      });
    }
    //Check Email
    const exist = await User.findOne({ email });
    //Check if username was entered
    if (exist) {
      return res.json({
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

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if email was entered
    if (!email) {
      return res.json({
        error: "Email is Required",
      });
    }
    //Check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    //Check if password was entered
    if (!password) {
      return res.json({
        error: "Password is Required",
      });
    }
    //Check if password match
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.json("password match");
    } else {
      return res.json({
        error: "Password does not match",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
