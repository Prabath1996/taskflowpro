const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Regiter User
  router.post('/signup', async (req, res) => {
  try {
    const { username,email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username,email, password: hashedPassword });
    const existingUser = await User.findOne({ email });

    if(existingUser){
      res.status(409).send( 'User with this email already exists' );
    }else{
      await newUser.save();
      res.status(201).send('User registered successfully');
    }
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});



// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
}
});


module.exports = router;